const chalk = require('chalk');
const path = require('path');
const process = require('process');

const cmd = require('../cmd');
const ssh = require('../ssh');


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
    await this._cmd(`init`);

    const validatorSshPrivateKeyPath = process.env['SSH_ID_RSA_VALIDATOR'];
    if(!validatorSshPrivateKeyPath) {
      console.log(chalk.red('Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_RSA_VALIDATOR'));
      process.exit(-1);
    }
    const publicNodeSshPrivateKeyPath = process.env['SSH_ID_RSA_PUBLIC'];
    if(!publicNodeSshPrivateKeyPath) {
      console.log(chalk.red('Please, export the path of the file with the private SSH key you want to use on public nodes as the environment variable SSH_ID_RSA_PUBLIC'));
      process.exit(-1);
    }

    const validatorSshPublicKey = ssh.publicKeyFromPrivateKeyPath(validatorSshPrivateKeyPath);
    const publicNodeSshPublicKey = ssh.publicKeyFromPrivateKeyPath(publicNodeSshPrivateKeyPath);

    console.log(`validatorSshPublicKey: ${validatorSshPublicKey}, publicNodeSshPublicKey: ${publicNodeSshPublicKey}`);
    process.exit(0);

    return this._cmd(`apply -var ssh_user=${this.config.defaultUser} -var validator_public_key=${validatorSshPublicKey} -var public_node_public_key=${publicNodeSshPublicKey} -auto-approve`);
  }

  async clean() {
    await this._cmd(`init`);
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
