const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config.terraform);
  }

  async sync() {
    await this.tf.sync();
  }

  async clean() {
    return this.tf.clean();
  }
}

module.exports = {
  Platform
}
