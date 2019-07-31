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
    //return cmd.exec(`ansible all -b -m ping -i ${inventoryFileName}`, this.options);
    return this._cmd(`main.yml -i ${inventoryFileName}`);
  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }

  _writeInventory() {
    const inventoryPath = path.join(this.ansiblePath, inventoryFileName);
    const inventoryContents = `[validator]
${this.config.validatorIpAddress}

[validator:vars]
ansible_user=root
vpnpeer_address=10.0.0.1
vpnpeer_cidr_suffix=24

[public1]
${this.config.public1IpAddress}

[public1:vars]
ansible_user=ubuntu
vpnpeer_address=10.0.0.2
vpnpeer_cidr_suffix=24

[public2]
${this.config.public2IpAddress}

[public2:vars]
ansible_user=${this.config.defaultUser}
vpnpeer_address=10.0.0.3
vpnpeer_cidr_suffix=24

[public3]
${this.config.public3IpAddress}

[public3:vars]
ansible_user=${this.config.defaultUser}
vpnpeer_address=10.0.0.4
vpnpeer_cidr_suffix=24

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
