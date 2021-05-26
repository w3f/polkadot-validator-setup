// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path';
import { nginxPassword, nginxUsername } from '../env';
import tpl from '../tpl';
import Project from '../project';
import cmd from '../cmd';
import chalk from 'chalk';
import { Config, ValidatorNode } from '../config/validateConfig/types';

const inventoryFileName = 'inventory';

const ANSIBLE_PATH = './ansible';

type Node = {
  ipAddress: string;
  sshUser: string;
  vpnAddress: string;
  nodeName: string;
};

type Data = {
  buildDir: string;
  chain: string;
  dbSnapshotChecksum?: string;
  dbSnapshotUrl?: string;
  nginxPassword: string;
  nginxUsername: string;
  nodeExporterBinaryChecksum?: string;
  nodeExporterBinaryUrl?: string;
  nodeExporterEnabled?: boolean;
  polkadotAdditionalCommonFlags?: string;
  polkadotAdditionalPublicFlags?: string;
  polkadotAdditionalValidatorFlags?: string;
  polkadotBinaryChecksum: string;
  polkadotBinaryUrl: string;
  polkadotNetworkId: string;
  polkadotRestartDay?: string;
  polkadotRestartEnabled?: boolean;
  polkadotRestartHour?: string;
  polkadotRestartMinute?: string;
  polkadotRestartMonth?: string;
  polkadotRestartWeekDay?: string;
  project: string;
  publicLoggingFilter?: string;
  publicNodes: Node[];
  publicTelemetryUrl?: string;
  validatorLoggingFilter?: string;
  validatorTelemetryUrl?: string;
  validators: Node[];
};

class Ansible {
  private readonly options: object;
  private readonly config: Config;

  constructor(cfg: Config) {
    this.config = cfg;

    this.options = {
      cwd: ANSIBLE_PATH,
      verbose: true,
    };
  }

  async runCommonPlaybook(playbookName: string) {
    const inventoryPath = this._writeInventory();
    return this._cmd(`${playbookName} -f 30 -i "${inventoryPath}"`);
  }

  async clean() {
    console.log(chalk.green('Clean not implemented yet'));
  }

  async _cmd(command: string, options = {}) {
    const actualOptions = Object.assign({}, this.options, options);
    return cmd.exec(`ansible-playbook ${command}`, actualOptions);
  }

  _writeInventory() {
    const origin = './tpl/ansible_inventory';
    const project = new Project(this.config);
    const buildDir = path.join(project.path(), 'ansible');
    const target = path.join(buildDir, inventoryFileName);

    const validators = this._genTplNodes(this.config.validators.nodes);
    const validatorTelemetryUrl = this.config.validators.telemetryUrl;
    const validatorLoggingFilter = this.config.validators.loggingFilter;
    const polkadotAdditionalValidatorFlags = this.config.validators.additionalFlags;

    let publicNodes: Node[] = [];
    let publicTelemetryUrl = '';
    let publicLoggingFilter = '';
    let polkadotAdditionalPublicFlags = '';
    if (this.config.publicNodes) {
      publicNodes = this._genTplNodes(this.config.publicNodes.nodes, validators.length);
      publicTelemetryUrl = this.config.publicNodes.telemetryUrl || '';
      publicLoggingFilter = this.config.publicNodes.loggingFilter || '';
      polkadotAdditionalPublicFlags = this.config.publicNodes.additionalFlags || '';
    }

    const data: Data = {
      buildDir,
      chain: this.config.chain || 'kusama',
      nginxPassword: nginxPassword,
      nginxUsername: nginxUsername,
      polkadotAdditionalCommonFlags: this.config.additionalFlags,
      polkadotAdditionalPublicFlags,
      polkadotAdditionalValidatorFlags,
      polkadotBinaryChecksum: this.config.polkadotBinary.checksum,
      polkadotBinaryUrl: this.config.polkadotBinary.url,
      polkadotNetworkId: this.config.polkadotNetworkId,
      project: this.config.project,
      publicLoggingFilter,
      publicNodes,
      publicTelemetryUrl,
      validatorLoggingFilter,
      validatorTelemetryUrl,
      validators,
    };

    if (this.config.nodeExporter?.enabled) {
      data.nodeExporterEnabled = true;
      data.nodeExporterBinaryUrl = this.config.nodeExporter.binary.url;
      data.nodeExporterBinaryChecksum = this.config.nodeExporter.binary.checksum;
    } else {
      data.nodeExporterEnabled = false;
    }

    if (this.config.polkadotRestart?.enabled) {
      data.polkadotRestartEnabled = true;
      data.polkadotRestartMinute = this.config.polkadotRestart.minute || '*';
      data.polkadotRestartHour = this.config.polkadotRestart.hour || '*';
      data.polkadotRestartDay = this.config.polkadotRestart.day || '*';
      data.polkadotRestartMonth = this.config.polkadotRestart.month || '*';
      data.polkadotRestartWeekDay = this.config.polkadotRestart.weekDay || '*';
    } else {
      data.polkadotRestartEnabled = false;
    }

    if (
      this.config.validators.dbSnapshot?.url !== undefined &&
      this.config.validators.dbSnapshot?.checksum !== undefined
    ) {
      data.dbSnapshotUrl = this.config.validators.dbSnapshot.url;
      data.dbSnapshotChecksum = this.config.validators.dbSnapshot.checksum;
    }

    tpl.create(origin, target, data);

    return target;
  }

  _genTplNodes(nodes: ValidatorNode[], offset = 0): Node[] {
    const output: Node[] = [];
    const vpnAddressBase = '10.0.0';
    let counter = offset;

    nodes.forEach((node) => {
      node.ipAddresses &&
        node.ipAddresses.forEach((ipAddress) => {
          counter++;
          const item: Node = {
            ipAddress,
            sshUser: node.sshUser,
            vpnAddress: `${vpnAddressBase}.${counter}`,
            nodeName: '',
          };
          if (node.nodeName) {
            item.nodeName = node.nodeName;
          }
          output.push(item);
        });
    });
    return output;
  }
}

export default Ansible;
