const fs = require('fs-extra');
const path = require('path');

const cmd = require('../cmd');
const ssh = require('../ssh');
const tpl = require('../tpl');


class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.terraformOriginPath = path.join(__dirname, '..', '..', '..', 'terraform');
    this.terraformFilesPath = path.join(__dirname, '..', '..', '..', 'build', cfg.project, 'terraform');

    this.options = {
      verbose: true
    };
  }

  async sync() {
    await this._initializeTerraform();
    await this._initState();

    const sshKeys = ssh.keys();

    const syncPromises = [
      this._create('validator', sshKeys.validatorPublicKey, this.config.validators.nodes),
      this._create('publicNode', sshKeys.publicNodePublicKey, this.config.publicNodes.nodes)
    ];

    return Promise.all(syncPromises);
  }

  async clean() {
    const cleanPromises = [
      this._destroy('validator', this.config.validators.nodes),
      this._destroy('publicNode', this.config.publicNodes.nodes)
    ];

    return Promise.all(cleanPromises);
  }

  nodeOutput(type, counter, outputField) {
    const cwd = this._terraformNodeDirPath(type, counter);
    const options = { cwd };

    return this._cmd(`output -json ${outputField}`, options);
  }

  async _create(type, sshKey, nodes) {
    const createPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      const tfPath = this._terraformNodeDirPath(type, counter);
      createPromises.push(this._createPromise(tfPath, sshKey, nodes[counter]));
    }
    return Promise.all(createPromises);
  }

  async _createPromise(cwd, sshKey, node) {
    const options = { cwd };
    await this._cmd(`init -var state_project=${this.config.state.project}`, options);

    this._createVarsFile(this.terraformFilesPath, node, sshKey);

    return this._cmd(`apply -auto-approve`, options);
  }

  async _destroy(type, nodes) {
    const destroyPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      const tfPath = this._terraformNodeDirPath(type, counter)
      destroyPromises.push(this._destroyPromise(tfPath));
    }
    return Promise.all(destroyPromises);
  }

  async _destroyPromise(cwd) {
    const options = { cwd };
    await this._cmd(`init -var state_project=${this.config.state.project}`, options);

    return this._cmd('destroy -lock=false -auto-approve', options);
  }

  async _cmd(command, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`terraform ${command}`, actualOptions);
  }

  async _initState(){
    const cwd = this._terraformNodeDirPath('remote-state');
    const options = { cwd };

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

  async _initializeTerraform() {
    console.log(`about to create ${this.terraformFilesPath}`);
    await fs.ensureDir(this.terraformFilesPath);

    this._copyTerraformFiles('remote-state', 0, 'remote-state');
    for (let counter = 0; counter < this.config.validators.nodes.length; counter++) {
      this._copyTerraformFiles('validator', counter, this.config.validators.nodes[counter].provider);
    }

    for (let counter = 0; counter < this.config.publicNodes.nodes.length; counter++) {
      this._copyTerraformFiles('publicNode', counter, this.config.publicNodes.nodes[counter].provider);
    }
  }

  _copyTerraformFiles(type, counter, provider) {
    const targetDirPath = this._terraformNodeDirPath(type, counter);
    const originDirPath = path.join(this.terraformOriginPath, provider);

    fs.copySync(originDirPath, targetDirPath);
  }

  _terraformNodeDirPath(type, counter=0) {
    const dirName = `${type}-${counter}`;
    return path.join(this.terraformFilesPath, dirName);
  }
}

module.exports = {
  Terraform
}
