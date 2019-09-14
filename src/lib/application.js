const { Ansible } = require('./clients/ansible');


class Application {
  constructor(cfg, platformResult={}) {
    const ansibleCfg = JSON.parse(JSON.stringify(cfg));

    for (let counter = 0; counter < this.config.validators.nodes.length; counter++) {
      ansibleCfg.validators.nodes[counter].ipAddresses = platformResult.validatorIpAddresses[counter];
    }

    for (let counter = 0; counter < this.config.publicNodes.nodes.length; counter++) {
      ansibleCfg.publicNodes.nodes[counter].ipAddresses = platformResult.publicNodesIpAddresses[counter];
    }

    this.ansible = new Ansible(ansibleCfg);
  }

  async sync() {
    return this.ansible.sync();
  }

  async clean() {
    return this.ansible.clean();
  }
}

module.exports = {
  Application
}
