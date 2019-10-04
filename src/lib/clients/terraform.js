const fs = require('fs-extra');
const path = require('path');

const cmd = require('../cmd');
const { Project } = require('../project');
const ssh = require('../ssh');
const tpl = require('../tpl');


class Terraform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const project = new Project(cfg);
    this.terraformOriginPath = path.join(__dirname, '..', '..', '..', 'terraform');
    this.terraformFilesPath = path.join(project.path(), 'terraform');

    this.options = {
      verbose: true
    };
  }

  async sync() {
    this._initializeTerraform();
    try {
      await this._initState();
    } catch(e) {
      console.log(`Allowed error creating state backend: ${e.message}`);
    }

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
      const backendConfig = this._backendConfig(type, counter);
      const nodeName = this._nodeName(type, counter);
      createPromises.push(this._createPromise(tfPath, sshKey, nodes[counter], backendConfig, nodeName));
    }
    return Promise.all(createPromises);
  }

  async _createPromise(cwd, sshKey, node, backendConfig, nodeName) {
    const options = { cwd };
    await this._cmd(`init -var state_project=${this.config.state.project} -backend-config=bucket=${backendConfig.bucket} -backend-config=prefix=${backendConfig.prefix}`, options);

    this._createVarsFile(cwd, node, sshKey, nodeName);

    return this._cmd(`apply -auto-approve`, options);
  }

  async _destroy(type, nodes) {
    const destroyPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      const tfPath = this._terraformNodeDirPath(type, counter)
      const backendConfig = this._backendConfig(type, counter);
      destroyPromises.push(this._destroyPromise(tfPath, backendConfig));
    }
    return Promise.all(destroyPromises);
  }

  async _destroyPromise(cwd, backendConfig) {
    const options = { cwd };
    await this._cmd(`init -var state_project=${this.config.state.project} -backend-config=bucket=${backendConfig.bucket} -backend-config=prefix=${backendConfig.prefix}`, options);

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
    const bucketName = this._bucketName()
    return this._cmd(`apply -var state_project=${this.config.state.project} -var name=${bucketName} -auto-approve`, options);
  }

  _createVarsFile(cwd, node, sshKey, nodeName) {
    const data = {
      stateProject: this.config.state.project,
      publicKey: sshKey,
      sshUser: node.sshUser,
      machineType: node.machineType,
      location: node.location,
      zone: node.zone,
      projectId: node.projectId,
      nodeCount: node.count || 1,
      name: nodeName
    }

    const source = path.join(__dirname, '..', '..', '..', 'tpl', 'tfvars');
    const target = path.join(cwd, 'terraform.tfvars');

    tpl.create(source, target, data);
  }

  _initializeTerraform() {
    fs.removeSync(this.terraformFilesPath);
    fs.ensureDirSync(this.terraformFilesPath);

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
    fs.ensureDirSync(targetDirPath);

    const name = this._nodeName(type, counter);

    fs.readdirSync(originDirPath).forEach((item) => {
      const origin = path.join(originDirPath, item);
      const target = path.join(targetDirPath, item);
      const data = {
        name
      };
      tpl.create(origin, target, data);
    });
  }

  _terraformNodeDirPath(type, counter=0) {
    const dirName = this._nodeName(type, counter);
    return path.join(this.terraformFilesPath, dirName);
  }

  _backendConfig(type, counter) {
    const bucket = this._bucketName();
    const prefix = this._nodeName(type, counter);

    return { bucket, prefix };
  }

  _bucketName() {
    return `${this.config.project}-sv-tf-state`
  }

  _nodeName(type, counter) {
    const name = `${type}${counter}`;
    return name.toLowerCase();
  }
}

module.exports = {
  Terraform
}
