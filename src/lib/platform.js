const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config);
  }

  async sync() {
    await this.tf.sync();

    const validatorIpAddresses = this._extractOutput(this.config.validators);
    const publicNodesIpAddresses = this._extractOutput(this.config.publicNodes);

    return { validatorIpAddresses, publicNodesIpAddresses };
  }

  async clean() {
    return this.tf.clean();
  }

  _extractOutput(nodeSet) {
    const output = [];
    nodeSet.nodes.forEach(async (node) => {
      const ipAddress = (await this.tf.nodeOutput(node.provider, 'ip_address')).toString();

      output.push(ipAddress);
    });

    return output;
  }
}

module.exports = {
  Platform
}
