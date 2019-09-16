const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config);
  }

  async sync() {
    await this.tf.sync();

    const validatorIpAddresses = await this._extractOutput(this.config.validators);
    const publicNodesIpAddresses = await this._extractOutput(this.config.publicNodes);

    return { validatorIpAddresses, publicNodesIpAddresses };
  }

  async clean() {
    return this.tf.clean();
  }

  async _extractOutput(nodeSet) {
    const output = [];
    for (let counter = 0; counter < nodeSet.length; counter++) {
      const ipAddress = (await this.tf.nodeOutput(nodeSet[counter].provider, 'ip_address')).toString();

      output.push(ipAddress);
    }
    return output;
  }
}

module.exports = {
  Platform
}
