const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config);
  }

  async sync() {
    await this.tf.sync();

    const validatorIpAddress = await this.tf.output('validator_ip_address');
    const public1IpAddress = await this.tf.output('public1_ip_address');
    const public2IpAddress = await this.tf.output('public2_ip_address');
    const public3IpAddress = await this.tf.output('public3_ip_address');

    return { validatorIpAddress, public1IpAddress, public2IpAddress, public3IpAddress };
  }

  async clean() {
    return this.tf.clean();
  }
}

module.exports = {
  Platform
}
