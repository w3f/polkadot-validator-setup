const { Ansible } = require('./clients/ansible');


class Application {
  constructor(cfg, platformResult={}) {
    const ansibleCfg = JSON.parse(JSON.stringify(cfg));

    for (let counter = 0; counter < ansibleCfg.validators.nodes.length; counter++) {
      ansibleCfg.validators.nodes[counter].ipAddresses = platformResult.validatorIpAddresses[counter];
    }

    if(ansibleCfg.publicNodes) {
      for (let counter = 0; counter < ansibleCfg.publicNodes.nodes.length; counter++) {
        ansibleCfg.publicNodes.nodes[counter].ipAddresses = platformResult.publicNodesIpAddresses[counter];
      }
    }

    this.ansible = new Ansible(ansibleCfg);
  }

  async sync() {
    return this.ansible.runCommonPlaybook("main.yml")
  }

  async updateBinary() {
    return this.ansible.runCommonPlaybook("main_update_binary.yml")
  }

  async restoreDB() {
    return this.ansible.runCommonPlaybook("main_restore_db.yml")
  }

  async rotateKeys() {
    return this.ansible.runCommonPlaybook("main_rotate_keys.yml")
  }

  async clean() {
    return this.ansible.clean();
  }
}

module.exports = {
  Application
}
