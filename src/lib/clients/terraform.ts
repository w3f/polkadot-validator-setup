import fs from 'fs-extra';
import path from 'path';
import cmd from '../cmd';
import Project from '../project';
import ssh from '../ssh';
import tpl from '../tpl';
import { NodeType } from '../platform';
import { Options } from '../cmd/cmd';
import { Config, Provider, ValidatorNode } from '../config/validateConfig/types';

type BackendConfig = {
  bucket: string;
  prefix: string;
};

type TerraformVarsData = {
  stateProject: string;
  publicKey: string;
  sshUser: string;
  machineType: string;
  location: string;
  zone?: string;
  projectId: string;
  nodeCount: number;
  name: string;
  image?: string;
};

class Terraform {
  private config: Config;
  private readonly terraformOriginPath: string;
  private readonly terraformFilesPath: string;
  private readonly options: { verbose: boolean };

  constructor(cfg: Config) {
    this.config = cfg;

    const project = new Project(cfg);
    this.terraformOriginPath = './terraform';
    this.terraformFilesPath = path.join(project.path(), 'terraform');

    this.options = {
      verbose: true,
    };
  }

  async initNodes() {
    await this._initNodes('validator', this.config.validators.nodes);
    this.config.publicNodes && (await this._initNodes('publicNode', this.config.publicNodes.nodes));
  }

  async sync(method = 'apply') {
    this._initializeTerraform();
    try {
      await this._initState();
    } catch (e) {
      console.log(`Allowed error creating state backend: ${e.message}`);
    }

    const sshKeys = ssh.keys();

    let validatorSyncPromises = [] as Promise<any>[];
    try {
      validatorSyncPromises = await this._create(
        'validator',
        sshKeys.validatorPublicKey,
        this.config.validators.nodes,
        method,
      );
    } catch (e) {
      console.log(`Could not get validator sync promises: ${e.message}`);
    }

    let publicNodeSyncPromises = [] as Promise<any>[];
    if (this.config.publicNodes) {
      try {
        publicNodeSyncPromises = await this._create(
          'publicNode',
          sshKeys.publicNodePublicKey,
          this.config.publicNodes.nodes,
          method,
        );
      } catch (e) {
        console.log(`Could not get publicNodes sync promises: ${e.message}`);
      }
    }
    const syncPromises = validatorSyncPromises.concat(publicNodeSyncPromises);

    return Promise.all(syncPromises);
  }

  async clean() {
    this._initializeTerraform();
    let validatorCleanPromises = [] as Promise<any>[];
    try {
      validatorCleanPromises = await this._destroy('validator', this.config.validators.nodes);
    } catch (e) {
      console.log(`Could not get validator clean promises: ${e.message}`);
    }

    let publicNodesCleanPromises = [] as Promise<any>[];
    if (this.config.publicNodes) {
      try {
        publicNodesCleanPromises = await this._destroy('publicNode', this.config.publicNodes.nodes);
      } catch (e) {
        console.log(`Could not get publicNodes clean promises: ${e.message}`);
      }
    }
    const cleanPromises = validatorCleanPromises.concat(publicNodesCleanPromises);

    return Promise.all(cleanPromises);
  }

  nodeOutput(type: NodeType, counter: string | number, outputField: string) {
    const cwd = this._terraformNodeDirPath(type, counter);
    const options = { cwd };

    return this._cmd(`output -json ${outputField}`, options);
  }

  async _create(type: NodeType, sshKey: string, nodes: ValidatorNode[], method = 'apply') {
    const createPromises = [] as Promise<any>[];

    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter);
      const backendConfig = this._backendConfig(type, counter);
      const nodeName = this._nodeName(type, counter);
      createPromises.push(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          const options = { cwd };
          await this._initCmd(backendConfig, options);
          this._createVarsFile(cwd, nodes[counter], sshKey, nodeName);

          let cmd = method;
          if (method === 'apply') {
            cmd += ' -auto-approve';
          }

          await this._cmd(cmd, options);

          resolve(true);
        }),
      );
    }
    return createPromises;
  }

  async _destroy(type: NodeType, nodes: ValidatorNode[]) {
    const destroyPromises = [];

    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter);
      const backendConfig = this._backendConfig(type, counter);
      destroyPromises.push(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          const options = { cwd };
          await this._initCmd(backendConfig, options);
          await this._cmd('destroy -lock=false -auto-approve', options);

          resolve(true);
        }),
      );
    }
    return destroyPromises;
  }

  async _cmd(command: string, options: Options) {
    const actualOptions = { ...this.options, ...options };
    return cmd.exec(`terraform ${command}`, actualOptions);
  }

  async _initCmd(backendConfig: BackendConfig, options: Options) {
    await this._cmd(
      `init -var state_project=${this.config.state.project} -backend-config=bucket=${backendConfig.bucket} -backend-config=prefix=${backendConfig.prefix}`,
      options,
    );
  }

  async _initState() {
    const cwd = this._terraformNodeDirPath('remote-state', 0);
    const options = { cwd };

    await this._cmd(`init -var state_project=${this.config.state.project}`, options);
    const bucketName = this._bucketName();
    return this._cmd(
      `apply -var state_project=${this.config.state.project} -var name=${bucketName} -auto-approve`,
      options,
    );
  }

  _createVarsFile(cwd: string, node: ValidatorNode, sshKey: string, nodeName: string) {
    const data: TerraformVarsData = {
      stateProject: this.config.state.project,
      publicKey: sshKey,
      sshUser: node.sshUser,
      machineType: node.machineType,
      location: node.location,
      zone: node.zone,
      projectId: node.projectId,
      nodeCount: node.count,
      name: nodeName,
    };

    if (node.image) {
      data.image = node.image;
    }

    const source = 'tpl/tfvars';
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

    if (this.config.publicNodes) {
      for (let counter = 0; counter < this.config.publicNodes.nodes.length; counter++) {
        this._copyTerraformFiles('publicNode', counter, this.config.publicNodes.nodes[counter].provider);
      }
    }
  }

  async _initNodes(type: NodeType, nodes: ValidatorNode[]) {
    for (let counter = 0; counter < nodes.length; counter++) {
      const cwd = this._terraformNodeDirPath(type, counter);
      const backendConfig = this._backendConfig(type, counter);
      const options = { cwd };
      await this._initCmd(backendConfig, options);
    }
  }

  _copyTerraformFiles(type: NodeType | 'remote-state', counter: number, provider: Provider | 'remote-state') {
    const targetDirPath = this._terraformNodeDirPath(type, counter);
    const originDirPath = path.join(this.terraformOriginPath, provider);
    fs.ensureDirSync(targetDirPath);

    const nodeName = this._nodeName(type, counter);
    const name = `${nodeName}-${this.config.project}`;

    fs.readdirSync(originDirPath).forEach((item) => {
      const origin = path.join(originDirPath, item);
      const target = path.join(targetDirPath, item);
      const data = {
        name,
      };
      tpl.create(origin, target, data);
    });
  }

  _terraformNodeDirPath(type: NodeType | 'remote-state', counter: number | string) {
    const dirName = this._nodeName(type, counter);
    return path.join(this.terraformFilesPath, dirName);
  }

  _backendConfig(type: NodeType, counter: number): BackendConfig {
    const bucket = this._bucketName();
    const prefix = this._nodeName(type, counter);

    return { bucket, prefix };
  }

  _bucketName() {
    return `${this.config.project}-sv-tf-state`;
  }

  _nodeName(type: NodeType | 'remote-state', counter: string | number) {
    const name = `${type}${counter}`;
    return name.toLowerCase();
  }
}

export default Terraform;
