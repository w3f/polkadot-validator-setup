const path = require('path');

const cmd = require('../cmd');
const { Project } = require('../project');
const tpl = require('../tpl');
const { nodeExporterUsername, nodeExporterPassword } = require('../env');

const inventoryFileName = 'inventory'


class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.ansiblePath = path.join(__dirname, '..', '..', '..', 'ansible');
    this.options = {
      cwd: this.ansiblePath,
      verbose: true
    };
  }

  async sync() {
    const inventoryPath = this._writeInventory();
    //return this._cmd(`all -b -m ping -i ${inventoryFileName}`, this.options);
    return this._cmd(`main.yml -f 30 -i "${inventoryPath}"`);
  }

  async clean() {

  }

  async updateBinary() {
    const inventoryPath = this._writeInventory();
    return this._cmd(`main_update_binary.yml -f 30 -i "${inventoryPath}"`);
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }

  _writeInventory() {
    const origin = path.resolve(__dirname, '..', '..', '..', 'tpl', 'ansible_inventory');
    const project = new Project(this.config);
    const buildDir = path.join(project.path(), 'ansible');
    const target = path.join(buildDir, inventoryFileName);

    const validators = this._genTplNodes(this.config.validators);
    const validatorTelemetryUrl = this.config.validators.telemetryUrl;
    const validatorLoggingFilter = this.config.validators.loggingFilter;
    const polkadotAdditionalValidatorFlags = this.config.validators.additionalFlags;

    let publicNodes = [];
    let publicTelemetryUrl = '';
    let publicLoggingFilter='';
    let polkadotAdditionalPublicFlags = '';
    if (this.config.publicNodes) {
      publicNodes = this._genTplNodes(this.config.publicNodes, validators.length);
      publicTelemetryUrl = this.config.publicNodes.telemetryUrl;
      publicLoggingFilter = this.config.publicNodes.loggingFilter;
      polkadotAdditionalPublicFlags = this.config.publicNodes.additionalFlags;
    }

    const data = {
      project: this.config.project,

      polkadotBinaryUrl: this.config.polkadotBinary.url,
      polkadotBinaryChecksum: this.config.polkadotBinary.checksum,
      chain: this.config.chain || 'kusama',
      polkadotNetworkId: this.config.polkadotNetworkId || 'ksmcc2',

      validators,
      publicNodes,

      validatorTelemetryUrl,
      publicTelemetryUrl,

      validatorLoggingFilter,
      publicLoggingFilter,

      buildDir,

      polkadotAdditionalCommonFlags: this.config.additionalFlags,
      polkadotAdditionalValidatorFlags,
      polkadotAdditionalPublicFlags
    };
    if (this.config.nodeExporter && this.config.nodeExporter.enabled) {
      data.nodeExporterEnabled = true;
      data.nodeExporterUsername = nodeExporterUsername;
      data.nodeExporterPassword = nodeExporterPassword;
      data.nodeExporterBinaryUrl = this.config.nodeExporter.binary.url;
      data.nodeExporterBinaryChecksum = this.config.nodeExporter.binary.checksum;
    } else {
      data.nodeExporterEnabled = false;
    }
    if (this.config.polkadotRestart && this.config.polkadotRestart.enabled) {
      data.polkadotRestartEnabled = true;
      data.polkadotRestartMinute = this.config.polkadotRestart.minute || '*';
      data.polkadotRestartHour = this.config.polkadotRestart.hour || '*';
      data.polkadotRestartDay = this.config.polkadotRestart.day || '*';
      data.polkadotRestartMonth = this.config.polkadotRestart.month || '*';
      data.polkadotRestartWeekDay = this.config.polkadotRestart.weekDay || '*';
    } else {
      data.polkadotRestartEnabled = false;
    }

    tpl.create(origin, target, data);

    return target;
  }

  _genTplNodes(nodeSet, offset=0) {
    const output = [];
    const vpnAddressBase = '10.0.0';
    let counter = offset;

    nodeSet.nodes.forEach((node) => {
      node.ipAddresses.forEach((ipAddress) => {
        counter++;
        const item = {
          ipAddress,
          sshUser: node.sshUser,
          vpnAddress: `${vpnAddressBase}.${counter}`
        };
        output.push(item);
      });
    });
    return output;
  }
}

module.exports = {
  Ansible
}
