const chalk = require('chalk');
const path = require('path');
const process = require('process');

const cmd = require('../cmd');
const ssh = require('../ssh');
const tpl = require('../tpl');


class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const terraformFilesPath = path.join(__dirname, '..', '..', '..', 'terraform');
    this.options = {
      cwd: terraformFilesPath,
      verbose: true
    };
  }

  async sync() {
    try {
      await this._initState();
    } catch(e) {
      // allow errors bc of state store already created.
      console.log(`Error initializing state: ${e.message}`);
    }

    const sshKeys = ssh.keys();

    const syncPromises = [
      this._create(sshKeys.validatorPublicKey, this.config.validators.nodes),
      this._create(sshKeys.publicNodePublicKey, this.config.publicNodes.nodes)
    ];

    return Promise.all(syncPromises);
  }

  async clean() {
    const cleanPromises = [
      this._destroy(this.config.validators.nodes),
      this._destroy(this.config.publicNodes.nodes)
    ];

    return Promise.all(cleanPromises);
  }

  async _create(sshKey, nodes) {
    const createPromises = [];

    nodes.forEach((node) => {
      createPromises.push(new Promise(async (resolve) => {
        const options = {
          cwd: path.join(this.options.cwd, node.provider)
        };
        await this._cmd(`init -var state_project=${this.config.state.project}`, options);

        this._createVarsFile(options.cwd, node, sshKey);

        await this._cmd(`apply -auto-approve`, options);
      }));
    });
    return Promise.all(createPromises);
  }

  async _destroy(nodes) {
    const destroyPromises = [];

    nodes.forEach((node) => {
      destroyPromises.push(new Promise(async (resolve) => {
        const options = {
          cwd: path.join(this.options.cwd, node.provider)
        };
        await this._cmd(`init -var state_project=${this.config.state.project}`, options);

        await this._cmd('destroy -auto-approve', options);
      }));
    });
    return Promise.all(destroyPromises);
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`terraform ${command}`, actualOptions);
  }

  async _initState(){
    const statePath = path.join(this.options.cwd, 'remote-state');
    const options = {
      cwd: statePath
    }

    await this._cmd(`init -var state_project=${this.config.state.project}`, options);
    return this._cmd(`apply -var state_project=${this.config.state.project} -auto-approve`, options);
  }

  _createVarsFile(cwd, node, sshKey) {
    const data = {
      stateProject: this.config.state.project,
      publicKey: sshKey,
      sshUser: node.sshUser,
      machineType: node.machineType,
      location: node.location,
      zone: node.zone,
      projectId: node.projectId
    }

    const source = path.join(__dirname, '..', '..', '..', 'tpl', 'tfvars');
    const target = path.join(cwd, 'terraform.tfvars');

    tpl.create(source, target, data);
  }
}

module.exports = {
  Terraform
}
