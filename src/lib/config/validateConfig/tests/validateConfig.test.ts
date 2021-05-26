import validateConfig from '../validateConfig';
import { expectErrors } from '../../../utils';

const validOptions = {
  project: 'my-project',
  additionalFlags: '--foo=bar',
  polkadotBinary: {
    url: 'https://github.com/paritytech/polkadot/releases/download/v0.8.30/polkadot',
    checksum: 'sha256:9dddd2ede827865c6e81684a138b0f282319e07f717c166b92834699f43274cd',
  },
  nodeExporter: {
    enabled: true,
    binary: {
      url: 'https://github.com/prometheus/node_exporter/releases/download/v1.0.1/node_exporter-1.0.1.linux-amd64.tar.gz',
      checksum: 'sha256:3369b76cd2b0ba678b6d618deab320e565c3d93ccb5c2a0d5db51a53857768ae',
    },
  },
  polkadotRestart: {
    enabled: true,
    minute: '50',
    hour: '4,12,20',
  },
  chain: 'kusama',
  polkadotNetworkId: 'ksmcc3',
  state: {
    project: 'my-project',
  },
  validators: {
    telemetryUrl: 'wss://telemetry-backend.w3f.community/submit',
    additionalFlags: '--unsafe-pruning --pruning 1000 --execution=native',
    dbSnapshot: {
      url: 'https://ksm-rocksdb.polkashots.io/kusama-7595617.RocksDb.7z',
      checksum: 'sha256:6159d3e3790f00455cd3dcc9c8238e7af07762d1a0d9956d9f407d5d22db0784',
    },
    loggingFilter: 'sync=trace,afg=trace,babe=debug',
    nodes: [
      {
        provider: 'aws',
        machineType: 'm4.large',
        count: 1,
        location: 'us-east-1',
        nodeName: 'my-project-node',
        projectId: 'my-project-id',
        sshUser: 'root',
        image: 'ami-09e67e426f25ce0d7',
      },
    ],
  },
};

describe('validateUserOptions', () => {
  it('returns the errors for required params', () => {
    const dto = {};

    const { error } = validateConfig(dto);
    const expectedErrors = [
      'project is a required field',
      'chain is a required field',
      'state.project is a required field',
      'polkadotBinary.url is a required field',
      'polkadotBinary.checksum is a required field',
      'nodeExporter.enabled is a required field',
      'polkadotNetworkId is a required field',
      'nodeExporter.binary.url is a required field',
      'nodeExporter.binary.checksum is a required field',
      'polkadotRestart.enabled is a required field',
    ];

    expectErrors(error?.errors, expectedErrors);
  });

  it('returns errors for invalid validator node params', () => {
    const invalidProvider = {
      ...validOptions,
      validators: {
        ...validOptions.validators,
        nodes: [
          {
            provider: '',
            machineType: '',
            count: 0,
            location: '',
            nodeName: '',
            projectId: '',
            sshUser: '',
            image: '',
          },
        ],
      },
    };

    const { error } = validateConfig(invalidProvider);
    const expectedErrors = [
      'validators.nodes[0].count must be greater than or equal to 1',
      'validators.nodes[0].location is a required field',
      'validators.nodes[0].machineType is a required field',
      'validators.nodes[0].nodeName is a required field',
      'validators.nodes[0].projectId is a required field',
      'validators.nodes[0].provider must be one of the following values: aws, azure, digitalocean, gcp, packet',
      'validators.nodes[0].sshUser is a required field',
    ];

    expectErrors(error?.errors, expectedErrors);
  });

  it('returns errors for invalid public node params', () => {
    const invalidProvider = {
      ...validOptions,
      publicNodes: {
        telemetryUrl: 'wss://telemetry-backend.w3f.community/submit',
        additionalFlags: '--unsafe-pruning --pruning 1000 --execution=native',
        dbSnapshot: {
          url: 'https://ksm-rocksdb.polkashots.io/kusama-7595617.RocksDb.7z',
          checksum: 'sha256:6159d3e3790f00455cd3dcc9c8238e7af07762d1a0d9956d9f407d5d22db0784',
        },
        loggingFilter: 'sync=trace,afg=trace,babe=debug',
        nodes: [
          {
            provider: '',
            machineType: '',
            count: 0,
            location: '',
            nodeName: '',
            projectId: '',
            sshUser: '',
            image: '',
          },
        ],
      },
    };

    const { error } = validateConfig(invalidProvider);
    const expectedErrors = [
      'publicNodes.nodes[0].count must be greater than or equal to 1',
      'publicNodes.nodes[0].location is a required field',
      'publicNodes.nodes[0].machineType is a required field',
      'publicNodes.nodes[0].nodeName is a required field',
      'publicNodes.nodes[0].projectId is a required field',
      'publicNodes.nodes[0].provider must be one of the following values: aws, azure, digitalocean, gcp, packet',
      'publicNodes.nodes[0].sshUser is a required field',
    ];

    expectErrors(error?.errors, expectedErrors);
  });

  it('returns errors for invalid checksum format', () => {
    const invalidChecksum = {
      ...validOptions,
      polkadotBinary: {
        url: '',
        checksum: '123',
      },
      nodeExporter: {
        enabled: true,
        binary: {
          url: '',
          checksum: '123',
        },
      },
    };

    const { error } = validateConfig(invalidChecksum);
    const expectedErrors = [
      'polkadotBinary.url is a required field',
      "checksum must be a sha256 string with the prefix 'sha256:'. e.g. 'sha256:3369b76cd2b0ba678b6d618deab320e565c3d93ccb5c2a0d5db51a53857768ae'",
      'nodeExporter.binary.url is a required field',
      "checksum must be a sha256 string with the prefix 'sha256:'. e.g. 'sha256:3369b76cd2b0ba678b6d618deab320e565c3d93ccb5c2a0d5db51a53857768ae'",
    ];

    expectErrors(error?.errors, expectedErrors);
  });
});
