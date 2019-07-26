const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config.terraform);
  }

  async sync() {
    await this.tf.sync();

    const ipAddress = await this.tf.output('ip_address');

    return { ipAddress };
  }

  async clean() {
    return this.tf.clean();
  }
}

module.exports = {
  Platform
}
