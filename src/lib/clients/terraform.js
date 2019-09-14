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

        //await this._cmd(`apply -auto-approve -var 'state_project=${this.config.state.project}' -var 'public_key=${sshKey}' -var 'ssh_user=${node.sshUser}' -var 'machine_type=${node.machineType}' -var 'location=${node.location}' -var 'zone=${node.zone}' -var 'project_id=${node.projectId}'`, options);
        await this._cmd(`apply -auto-approve -var state_project=${this.config.state.project} -var 'public_key="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n"' -var ssh_user=${node.sshUser} -var machine_type=${node.machineType} -var location=${node.location} -var zone=${node.zone} -var project_id=${node.projectId}`, options);
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
}

module.exports = {
  Terraform
}
