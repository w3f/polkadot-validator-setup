const { Ansible } = require('./clients/ansible');
const { Helm } = require('./clients/helm');


class Application {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.ansible = new Ansible(this.config.ansible);
    this.wg = new WireGuard(this.config.wireguard);
    this.helm = new Helm(this.config.helm);
  }

  async sync() {
    const promises = [];
    promises.push(this.ansible.sync({ keys }));
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
