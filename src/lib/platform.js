const asyncUtils = require('./async.js');
const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config);
  }

  async sync() {
    await this.tf.sync();

    const validatorIpAddresses = await this._extractOutput(this.config.validators.nodes);
    const publicNodesIpAddresses = await this._extractOutput(this.config.publicNodes.nodes);

    return { validatorIpAddresses, publicNodesIpAddresses };
  }

  async clean() {
    return this.tf.clean();
  }

  async _extractOutput(nodeSet) {
    const output = [];
    await asyncUtils.forEach(nodeSet, async (node) => {
      const ipAddress = await this.tf.nodeOutput(node.provider, 'ip_address');
      output.push([ipAddress.toString().trim()]);
    });
    return output;
  }
}

module.exports = {
  Platform
}
