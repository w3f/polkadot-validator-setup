const fs = require('fs-extra');
const path = require('path');

const cmd = require('../cmd');

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
[validator]
${this.config.validatorIpAddress}

[public1]
${this.config.public1IpAddress}

[public1:vars]
ansible_user=ubuntu

[public2]
${this.config.public2IpAddress}

[public2:vars]
ansible_user={this.config.defaultUser}

[public3]
${this.config.public3IpAddress}

[public3:vars]
ansible_user={this.config.defaultUser}

[public:children]
public1
public2
public3
`;
    fs.writeFileSync(inventoryPath, inventoryContents);
  }
}


module.exports = {
  Ansible
}
