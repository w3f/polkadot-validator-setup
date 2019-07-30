const path = require('path');

const cmd = require('../cmd');


class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const terraformFilesPath = path.join(__dirname, '..', '..', '..', 'terraform-modules', 'secure-validator');
    this.options = {
      cwd: terraformFilesPath,
      verbose: true
    };
  }

  async sync() {
    return this._cmd(`apply -var ssh_user=${this.config.defaultUser} -auto-approve`);
  }

  async clean() {
    return this._cmd(`destroy -auto-approve`);
  }

  async output(field) {
    return this._cmd(`output ${field}`);
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`terraform ${command}`, actualOptions);
  }
}


module.exports = {
  Terraform
}
