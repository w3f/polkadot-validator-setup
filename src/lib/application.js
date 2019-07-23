const { Ansible } = require('./clients/ansible');


class Application {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.ansible = new Ansible(this.config.ansible);
  }

  async sync() {

  }
}

module.exports = {
  Application
}
