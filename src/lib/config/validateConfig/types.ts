type GCPStateProjectId = string;

export enum Provider {
  AWS = 'aws',
  Packet = 'packet',
  GCP = 'gcp',
  Azure = 'azure',
  DigitalOcean = 'digitalocean',
}

export const AVAILABLE_PROVIDERS = [Provider.AWS, Provider.Azure, Provider.DigitalOcean, Provider.GCP, Provider.Packet];

export type IPAddresses = string[];

export type ValidatorNode = {
  image?: string;
  zone?: string;
  provider: Provider;
  machineType: string;
  count: number;
  location: string;
  projectId: string;
  sshUser: string;
  nodeName: string;
  ipAddresses?: IPAddresses;
};

export type Config = {
  project: string;
  polkadotNetworkId: string;
  additionalFlags: string;
  polkadotBinary: {
    url: string;
    checksum: string;
  };
  nodeExporter: {
    enabled: boolean;
    binary: {
      url: string;
      checksum: string;
    };
  };
  polkadotRestart?: {
    enabled: boolean;
    minute?: string;
    hour?: string;
    day?: string;
    month?: string;
    weekDay?: string;
  };
  chain: string;
  state: {
    project: GCPStateProjectId;
  };
  publicNodes: {
    telemetryUrl?: string;
    loggingFilter?: string;
    additionalFlags?: string;
    nodes: ValidatorNode[];
  };
  validators: {
    telemetryUrl?: string;
    loggingFilter?: string;
    additionalFlags?: string;
    dbSnapshot?: {
      url?: string;
      checksum?: string;
    };
    nodes: ValidatorNode[];
  };
};
