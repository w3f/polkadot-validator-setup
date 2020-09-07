const asyncUtils = require('./async.js');
const { Terraform } = require('./clients/terraform');


class Platform {
  constructor(cfg) {
    this.config = JSON.parse(JSON.stringify(cfg));

    this.tf = new Terraform(this.config);
  }

  async sync() {
    await this.tf.sync('apply');
    const validatorIpAddresses = await this._getValidatorIpAddresses();
    const publicNodesIpAddresses = await this._getPublicNodesIpAddresses();
    return { validatorIpAddresses, publicNodesIpAddresses };
  }

  async output() {
    await this.tf.initNodes();
    const validatorIpAddresses = await this._getValidatorIpAddresses();
    const publicNodesIpAddresses = await this._getPublicNodesIpAddresses();
    return { validatorIpAddresses, publicNodesIpAddresses };
  }

  async plan() {
    return this.tf.sync('plan');
  }

  async clean() {
    return this.tf.clean();
  }

  async _extractOutput(type, nodeSet) {
    const output = [];
    await asyncUtils.forEach(nodeSet, async (node, index) => {
      const ipAddress = await this.tf.nodeOutput(type, index, 'ip_address');
      output.push(JSON.parse(ipAddress.toString()));
    });
    return output;
  }

  async _getValidatorIpAddresses() {
    return await this._extractOutput('validator', this.config.validators.nodes);
  }

  async _getPublicNodesIpAddresses() {
    if(this.config.publicNodes){
      return await this._extractOutput('publicNode', this.config.publicNodes.nodes);
    }
    return []
  }
}

module.exports = {
  Platform
}
