const fs = require('fs-extra');
const path = require('path');

const cmd = require('../cmd');
const secrets = require('../secrets');

const inventoryFileName = 'inventory'


class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.ansiblePath = path.join(__dirname, '..', '..', '..', 'ansible');
    this.options = {
      cwd: this.ansiblePath,
      verbose: true
    };

    this.vpnSecret = secrets.vpnSecret();
  }

  async sync() {
    this._writeInventory();
    return this._cmd(`main.yaml -i ${inventoryFileName}`);
  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }

  _writeInventory() {
    const inventoryPath = path.join(this.ansiblePath, inventoryFileName);
    const inventoryContents = `
${this.config.ipAddress}
${this.vpnSecret}
`;
    fs.writeFileSync(inventoryPath, inventoryContents);
  }
}


module.exports = {
  Ansible
}
