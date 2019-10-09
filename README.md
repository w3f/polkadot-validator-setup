[![CircleCI](https://circleci.com/gh/w3f/polkadot-secure-validator.svg?style=svg)](https://circleci.com/gh/w3f/polkadot-secure-validator)

# Polkadot Secure Validator Setup

This repo describes a potential setup for a polkadot validator that aims to prevent
some types of potential attacks.

## How to use

This repo has code for creating a complete implementaion of the approach
described [here](https://hackmd.io/QSJlqjZpQBihEU_ojmtR8g) from scratch, included
both layers described in [Workflow](#workflow). This can be done on a host with
node, yarn and git installed with:

```
$ git clone https://github.com/w3f/secure-validator
$ cd secure-validator
$ yarn
$ cp config/main.sample.json config/main.json
# now you should customize config/main.json
$ yarn sync
```
You will need credentials as environment variables for all the infrastructure providers
used in the platform creation phase. The tool now supports AWS, Azure, GCP and packet,
these are the required variables:

* AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
* Azure: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`,
`ARM_TENANT_ID`, `TF_VAR_client_id` (same as `ARM_CLIENT_ID`),
`TF_VAR_client_secret` (same as `ARM_CLIENT_SECRET`).
* GCP: `GOOGLE_APPLICATION_CREDENTIALS` (path to json file with credentials of
the service account you want to use)
* PACKET: `TF_VAR_auth_token`

The allows you to specify which providers to use, so you don't need to have
accounts in all of them, see [here](https://github.com/w3f/polkadot-secure-validator/blob/master/config/main.sample.json)
for an example of how to define the providers. You could use, for instance,
packet for the validators and GCP for the public nodes. Keep in mind that, the
more distributed your public nodes, the fewer opportunities to be affected by
potential incidents in the respective cloud providers.

You need two additional environment variables to allow ansible to connect to the
created machines:

* `SSH_ID_RSA_PUBLIC`: path to private SSH key you want to use for the public
nodes.

* `SSH_ID_RSA_VALIDATOR`: path to private SSH key you want to use for the
validators.

You can also just provision a set of previously created machines with the ansible code
[here](./ansible). We have provided an [example inventory](./ansible/inventory.sample)
that you can customize.

## Structure

The secure validator setup is composed of a bare-metal machine that runs the
actual validator and a set of cloud nodes connected to it. The validator is
isolated from the internet and only has access to the polkadot network through
the cloud nodes, which are accessible from the internet and are connected to
the rest of the polkadot network.

The connection between the validator node and the cloud nodes is performed
defining a VPN to which all these nodes belong. The polkadot instance running in
the validator node is configured to only listen on the VPN-attached interface,
and uses the cloud node's VPN address in the `--reserved-nodes` parameter. It is
also protected by a firewall that only allows connections on the VPN port.

This way, the only nodes allowed to connect to the validator are the public nodes
through the VPN. Messages sent by other validators can still reach it through
gossiping, and these validators can know the IP address of the secure validator
because of this, but can't directly connect to it without being part of the VPN.

*WARNING*

If you use this tool to create and/or configure your validator setup or
implement your setup based on this approach take into account that if you add
public telemetry endpoints to your nodes (either the validator or the public
nodes) then the IP address of the validator will be publicly available too,
given that the contents of the network state RPC call are sent to telemetry.

Even though the secure validator in this setup only has the VPN port open and
Wireguard has a reasonable [approach to mitigate DoS attacks](https://www.wireguard.com/protocol/#dos-mitigation),
we recommend to not send this information to endpoints publicly accessible.

## Workflow

The secure validator setup is structured in two layers, an underlaying platform
and the applications that run on top of it.

### Platform creation

Because of the different nature of the validator and the cloud nodes, the
platform is hybrid, consisting of a bare-metal machine and cloud instances.
However, we use terraform for creating both. The code for setting up the 
bare-metal machine is in the [terraform-modules](/terraform-modules) dir
of this repository.

The cloud instances are created on 3 different cloud providers for increased
resiliency, and the bare-metal machine on packet.com. As part of the creation
process of the cloud instances we define a hardware firewall to only allow access
on the VPN and p2p ports.

### Application creation

This is done through the ansible playbook and roles located at [ansible](/ansible), the
configuration applied depend on the type of node:

* Common:

    * Software firewall setup, for the validator we only allow the VPN and SSH
    ports, for the public nodes VPN SSH and p2p ports.

    * VPN setup: for the VPN solution we are using [WireGuard](https://github.com/WireGuard/WireGuard),
    at this stage we create the private and public keys on each node, making the
    public keys available to ansible.

    * VPN install: we install and configure WireGuard on each host using the public
    keys from the previous stage. The configuration for the validator looks like:

        ```
        [Interface]
        PrivateKey = <...>
        ListenPort = 51820
        SaveConfig = true
        Address = 10.0.0.1/24

        [Peer]
        PublicKey = 8R7PTv1CdNLHRsDvrvE58Ac0Inc9vOLY2vFMWIFV/W4=
        AllowedIPs = 10.0.0.2/32
        Endpoint = 64.93.77.93:51820

        [Peer]
        PublicKey = ZZW6Wuk+YjJToeLHIUrp0HAqfNozgQfUMo2owC2Imzg=
        AllowedIPs = 10.0.0.3/32
        Endpoint = 50.81.184.50:51820

        [Peer]
        PublicKey = LZHKtuGCxz9iCoNNDmQzzNe9eF9aLXj/4yJRkFjCWzM=
        AllowedIPs = 10.0.0.4/32
        Endpoint = 45.243.244.130:51820
        ```

    * Polkadot setup: create a polkadot user and group and download the binary.

* Public nodes:

    * Start Polkadot service: the public nodes are started and we make the libp2p peer
    id of the node available to ansible. The generated systemd unit looks like:

        ```
        [Unit]
        Description=Polkadot Node

        [Service]
        ExecStart=/usr/local/bin/polkadot --name sv-public-0

        Restart=always

        [Install]
        WantedBy=multi-user.target
        ```

* Private (validator) node:

    * Start Polkadot service: the private (validator) node is started with the node's VPN address as part
    of the listen multiaddr and the multiaddr of the public nodes (with the peer id
    from the previous stage and the VPN addresses) as `reserved-nodes`. It looks like:

        ```
        [Unit]
        Description=Polkadot Node

        [Service]
        ExecStart=/usr/local/bin/polkadot \
            --name sv-private \
            --validator \
            --listen-addr=/ip4/10.0.0.1/tcp/30333 \
            --reserved-nodes /ip4/10.0.0.2/tcp/30333/p2p/QmNpQbu2nKfHQMySnCue3XC9mAjBfzi8DQ9KvNwUM8jZdx \
            --reserved-nodes /ip4/10.0.0.3/tcp/30333/p2p/QmY81TLZKeNj4mGDAhFQE6RrHEJPidAkccgUTsJo7ifNFJ \
            --reserved-nodes /ip4/10.0.0.4/tcp/30333/p2p/QmTwMDJDnPyHUHV2fZFcVbNpYzp6Fu7LP6VhhK3Ei13iXr

        Restart=always

        [Install]
        WantedBy=multi-user.target
        ```

## Scopes

This setup partitions the network in 3 separate kind of nodes: secure validator,
its public node and the regular network nodes, haveing each group a different
vision and accessiblity to the rest of the network. To verify this, we'll execute
the `system_networkState` RPC call on nodes of each partition:

```
curl -H "Content-Type: application/json" --data '{ "jsonrpc":"2.0", "method":"system_networkState", "params":[],"id":1 }' localhost:9933
```

### Validator

It can only reach and be reached by its public nodes, from the
`system_networkState` RPC call:
```
{

  [ ........ ]

  "result": {
    "connectedPeers": {

      [ only validator's public nodes shown here]

      "QmPjNcWNZjNrjVFzkNYR6jH7HLqyU7j9piczUyNoxce1fD": {
        "enabled": true,
        "endpoint": {
          "dialing": "/ip4/10.0.0.2/tcp/30333"
        },
        "knownAddresses": [
          "/ip6/::1/tcp/30333",
          "/ip4/10.0.0.2/tcp/30333",
          "/ip4/127.0.0.1/tcp/30333",
          "/ip4/172.26.59.86/tcp/30333",
          "/ip4/18.197.157.119/tcp/30333"
        ],
        "latestPingTime": {
          "nanos": 256512049,
          "secs": 0
        },
        "open": true,
      },

      [ ........ ]

    },
    "notConnectedPeers": {

      [ always known regular nodes: boot nodes, other validators, etc ]

      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "knownAddresses": [
          "/dns4/p2p.testnet-4.kusama.network/tcp/30100"
        ],
        "latestPingTime": null,
        "versionString": null
      },

      [ ........ ]

    },
    "peerset": {

      [ all known nodes shown here, only reported connected to validator's public nodes ]

      "QmPjNcWNZjNrjVFzkNYR6jH7HLqyU7j9piczUyNoxce1fD": {
        "connected": true,
        "reputation": 1114
      },
      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "connected": false,
        "reputation": 0
      },

      [ ........ ]

      "reserved_only": true
    }
  }
}

```

### Validator's public nodes

They can reach and be reached both by the validator and by the network regular
nodes:
```
{

  [ ........ ]

  "result": {
    "connectedPeers": {

      [ secure validator, other secure validator's public nodes and regular nodes]

      "QmZSocEssLWHYCY6mqR99DcSFEpMb95fVeMsScrY8jqBm8": {
        "enabled": true,
        "endpoint": {
          "listening": {
            "listen_addr": "/ip4/10.0.0.2/tcp/30333",
            "send_back_addr": "/ip4/10.0.0.1/tcp/54932"
          }
        },
        "knownAddresses": [
          "/ip4/10.0.0.1/tcp/30333",
          "/ip4/10.0.1.18/tcp/30333",
          "/ip4/147.75.199.231/tcp/30333",
          "/ip4/10.0.1.152/tcp/30333"
        ],
        "latestPingTime": {
          "nanos": 335876602,
          "secs": 0
        },
        "open": true,
      },
      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "enabled": true,
        "endpoint": {
          "listening": {
            "listen_addr": "/ip4/172.26.59.86/tcp/30333",
            "send_back_addr": "/ip4/191.232.49.216/tcp/3008"
          }
        },
        "knownAddresses": [
          "/dns4/p2p.testnet-4.kusama.network/tcp/30100",
          "/ip4/127.0.0.1/tcp/30100",
          "/ip4/10.244.0.10/tcp/30100",
          "/ip4/191.232.49.216/tcp/30100"
        ],
        "latestPingTime": {
          "nanos": 603313251,
          "secs": 0
        },
        "open": true,
      },

      [ ........ ]

    },
    "notConnectedPeers": {

      [ regular nodes ]

      "QmW45D6YLfctkSnsjyoqcSxw9qoiXUmAFGn5ea99L6SC7X": {
        "knownAddresses": [
          "/ip4/10.8.2.14/tcp/30101",
          "/ip4/127.0.0.1/tcp/30101",
          "/ip4/34.80.190.48/tcp/30101"
        ],
        "latestPingTime": {
          "nanos": 571989635,
          "secs": 0
        },
      },

      [ ........ ]

    },
    "peerset": {

      [ all known nodes reported as connected here ]

      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "connected": true,
        "reputation": 1277
      },
      "QmZSocEssLWHYCY6mqR99DcSFEpMb95fVeMsScrY8jqBm8": {
        "connected": true,
        "reputation": -571
      },

      [ ........ ]

      "reserved_only": false
    }
  }
}
```

### Network regular nodes

They can reach and be reached by the validator's public nodes and by other regular
nodes, the don't have access to the validator.
```
{

  [ ........ ]

  "result": {
    "connectedPeers": {

      [ secure validator's public nodes and regular nodes ]

      "QmPjNcWNZjNrjVFzkNYR6jH7HLqyU7j9piczUyNoxce1fD": {
        "enabled": true,
        "endpoint": {
          "listening": {
            "listen_addr": "/ip4/10.44.1.11/tcp/30101",
            "send_back_addr": "/ip4/18.197.157.119/tcp/42962"
          }
        },
        "knownAddresses": [
          "/ip4/172.26.59.86/tcp/30333",
          "/ip4/127.0.0.1/tcp/30333",
          "/ip6/::1/tcp/30333",
          "/ip4/18.197.157.119/tcp/30333",
          "/ip4/10.0.0.2/tcp/30333",
          "/ip4/10.0.1.18/tcp/30333"
        ],
        "latestPingTime": {
          "nanos": 108101687,
          "secs": 0
        },
        "open": true,
      },
      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "enabled": true,
        "endpoint": {
          "listening": {
            "listen_addr": "/ip4/10.44.1.11/tcp/30101",
            "send_back_addr": "/ip4/191.232.49.216/tcp/3010"
          }
        },
        "knownAddresses": [
          "/dns4/p2p.testnet-4.kusama.network/tcp/30100",
          "/ip4/127.0.0.1/tcp/30100",
          "/ip4/191.232.49.216/tcp/30100",
          "/ip4/10.244.0.10/tcp/30100"
        ],
        "latestPingTime": {
          "nanos": 717286051,
          "secs": 0
        },
        "open": true,
        "versionString": "parity-polkadot/v0.5.0-4e53ad1-x86_64-linux-gnu (unknown)"
      },

      [ ........ ]

    },
    "notConnectedPeers": {

      [ secure validator ]

      "QmZSocEssLWHYCY6mqR99DcSFEpMb95fVeMsScrY8jqBm8": {
        "knownAddresses": [
          "/ip4/10.0.0.1/tcp/30333",
          "/ip4/10.0.1.18/tcp/30333",
          "/ip4/10.0.1.152/tcp/30333",
          "/ip4/147.75.199.231/tcp/30333"
        ],
        "latestPingTime": {
          "nanos": 375552762,
          "secs": 0
        },
      }

      [ ........ ]

    },
    "peerset": {

      [ all known nodes shown here, reported connected to all, secure validator with 0 reputation ]

      "QmP3zYRhAxxw4fDf6Vq5agM8AZt1m2nKpPAEDmyEHPK5go": {
        "connected": true,
        "reputation": 1115
      },
      "QmPjNcWNZjNrjVFzkNYR6jH7HLqyU7j9piczUyNoxce1fD": {
        "connected": true,
        "reputation": 3500
      },
      "QmZSocEssLWHYCY6mqR99DcSFEpMb95fVeMsScrY8jqBm8": {
        "connected": true,
        "reputation": 0
      },

      [ ........ ]

      "reserved_only": false
    }
  }
}
```
