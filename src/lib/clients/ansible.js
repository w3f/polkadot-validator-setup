const path = require('path');

const cmd = require('../cmd');
const tpl = require('../tpl');

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
    this._writeInventory();
    //return this._cmd(`all -b -m ping -i ${inventoryFileName}`, this.options);
    return this._cmd(`main.yml -i ${inventoryFileName}`);
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
    const data = {
      project: this.config.project,

      polkadotBinaryUrl: this.config.polkadotBinaryUrl,

      validators: this._genTplNodes(this.config.validators),
      publicNodes: this._genTplNodes(this.config.publicNodes, this.config.validators.nodes.length),

      validatorTelemetryUrl: this.config.validators.telemetryUrl,
      publicTelemetryUrl: this.config.publicNodes.telemetryUrl,
    };

    tpl.create(origin, target, data);
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
