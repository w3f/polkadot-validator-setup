import Ansible from './clients/ansible';
import { PlatformResult } from './platform';
import { Config } from './config/validateConfig/types';

class Application {
  private ansible: Ansible;

  constructor(ansibleCfg: Config, platformResult: PlatformResult) {
    for (let counter = 0; counter < ansibleCfg.validators.nodes.length; counter++) {
      ansibleCfg.validators.nodes[counter].ipAddresses = platformResult.validatorIpAddresses[counter];
    }

    if (ansibleCfg.publicNodes) {
      for (let counter = 0; counter < ansibleCfg.publicNodes.nodes.length; counter++) {
        ansibleCfg.publicNodes.nodes[counter].ipAddresses = platformResult.publicNodesIpAddresses[counter];
      }
    }

    this.ansible = new Ansible(ansibleCfg);
  }

  async sync() {
    return this.ansible.runCommonPlaybook('main.yml');
  }

  async updateBinary() {
    return this.ansible.runCommonPlaybook('main_update_binary.yml');
  }

  async restoreDB() {
    return this.ansible.runCommonPlaybook('main_restore_db.yml');
  }

  async rotateKeys() {
    return this.ansible.runCommonPlaybook('main_rotate_keys.yml');
  }

  async clean() {
    return this.ansible.clean();
  }
}

export default Application;
