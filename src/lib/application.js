const { Ansible } = require('./clients/ansible');
const { Helm } = require('./clients/helm');


class Application {
  constructor(cfg, platformResult={}) {
    this.config = JSON.parse(JSON.stringify(cfg));

    const ansibleCfg = Object.assign({}, this.config.ansible, platformResult);
    this.ansible = new Ansible(ansibleCfg);
    this.helm = new Helm(this.config.helm);
  }

  async sync() {
    const promises = [];
    promises.push(this.ansible.sync());
    promises.push(this.helm.sync());
    return Promise.all(promises);
  }

  async clean() {
    const promises = [];
    promises.push(this.ansible.clean());
    promises.push(this.helm.clean());
    return Promise.all(promises);
  }
}

module.exports = {
  Application
}
