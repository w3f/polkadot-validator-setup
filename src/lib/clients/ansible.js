const path = require('path');

const cmd = require('../cmd');
const { Project } = require('../project');
const tpl = require('../tpl');

const inventoryFileName = 'inventory'


class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const project = new Project(cfg);
    this.ansiblePath = path.join(project.path(), 'ansible');
    this.options = {
      cwd: this.ansiblePath,
      verbose: true
    };
  }

  async sync() {
    const inventoryPath = this._writeInventory();
    //return this._cmd(`all -b -m ping -i ${inventoryFileName}`, this.options);
    return this._cmd(`main.yml -i ${inventoryPath}`);
  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }

  _writeInventory() {
    const origin = path.resolve(__dirname, '..', '..', '..', 'tpl', 'ansible_inventory');
    const target = path.join(this.ansiblePath, inventoryFileName);
    const validators = this._genTplNodes(this.config.validators);
    const publicNodes = this._genTplNodes(this.config.publicNodes, validators.length);
    const data = {
      project: this.config.project,

      polkadotBinaryUrl: this.config.polkadotBinaryUrl,

      validators,
      publicNodes,

      validatorTelemetryUrl: this.config.validators.telemetryUrl,
      publicTelemetryUrl: this.config.publicNodes.telemetryUrl,
    };

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
