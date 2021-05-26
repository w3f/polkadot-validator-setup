import awaitCallback from './awaitCallback.js';
import Terraform from './clients/terraform';
import { Config, IPAddresses, ValidatorNode } from './config/validateConfig/types';

export type PlatformResult = {
  validatorIpAddresses: IPAddresses[];
  publicNodesIpAddresses: IPAddresses[];
};

export type NodeType = 'publicNode' | 'validator';

class Platform {
  private tf: Terraform;
  private config: Config;

  constructor(cfg: Config) {
    this.config = cfg;
    this.tf = new Terraform(cfg);
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

  async _extractOutput(nodeType: NodeType, nodeSet: ValidatorNode[]): Promise<IPAddresses[]> {
    const output: IPAddresses[] = [];
    await awaitCallback.forEach(nodeSet, async (_, index) => {
      const ipAddress = await this.tf.nodeOutput(nodeType, index, 'ip_address');
      output.push(JSON.parse(ipAddress.toString()));
    });
    return output;
  }

  async _getValidatorIpAddresses() {
    return await this._extractOutput('validator', this.config.validators.nodes);
  }

  async _getPublicNodesIpAddresses() {
    if (this.config.publicNodes) {
      return await this._extractOutput('publicNode', this.config.publicNodes.nodes);
    }
    return [];
  }
}

export default Platform;
