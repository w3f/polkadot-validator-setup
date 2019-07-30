const { Ansible } = require('./clients/ansible');


class Application {
  constructor(cfg, platformResult={}) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const ansibleCfg = Object.assign({}, this.config.ansible, platformResult);
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
