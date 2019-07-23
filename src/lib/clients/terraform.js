const path = require('path');

const cmd = require('../cmd');


class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const terraformFilesPath = path.join(__dirname, '..', '..', 'terraform-modules', 'secure-validator', 'packet');
    this.options = {
      cwd: terraformFilesPath,
      verbose: cfg.verbose
    };
  }

  async sync() {
    /*
    try {

    } catch(e) {

    }
    */
  }

  async clean() {

  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`terraform ${command}`, actualOptions);
  }
}


module.exports = {
  Terraform
}
