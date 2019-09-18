const path = require('path');

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
    await this._initState();

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

  nodeOutput(provider, outputField) {
    const options = {
      cwd: path.join(this.options.cwd, provider)
    };

    return this._cmd(`output -json ${outputField}`, options);
  }

  async _create(sshKey, nodes) {
    const createPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      createPromises.push(this._createPromise(sshKey, nodes[counter]));
    }
    return Promise.all(createPromises);
  }

  async _createPromise(sshKey, node) {
    const options = {
      cwd: path.join(this.options.cwd, node.provider)
    };
    await this._cmd(`init -var state_project=${this.config.state.project}`, options);

    this._createVarsFile(options.cwd, node, sshKey);

    return this._cmd(`apply -auto-approve`, options);
  }

  async _destroy(nodes) {
    const destroyPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      destroyPromises.push(this._destroyPromise(nodes[counter].provider));
    }
    return Promise.all(destroyPromises);
  }

  async _destroyPromise(provider) {
    const options = {
      cwd: path.join(this.options.cwd, provider)
    };
    await this._cmd(`init -var state_project=${this.config.state.project}`, options);

    return this._cmd('destroy -auto-approve', options);
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
      projectId: node.projectId,
      nodeCount: node.count || 1
    }

    const source = path.join(__dirname, '..', '..', '..', 'tpl', 'tfvars');
    const target = path.join(cwd, 'terraform.tfvars');

    tpl.create(source, target, data);
  }
}

module.exports = {
  Terraform
}
