const cmd = require('../cmd');


class Ansible {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));
  }

  async sync() {

  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }
}


module.exports = {
  Ansible
}
