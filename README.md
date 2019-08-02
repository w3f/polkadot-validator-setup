# Polkadot Secure Validator Setup

This repo describes a potential setup for a polkadot validator that aims to prevent
some types of potential attacks.

## How to use

This repo has code for creating a complete implementaion of the approach
described [here](https://hackmd.io/QSJlqjZpQBihEU_ojmtR8g) from scratch, included
both layers described in [Workflow](#workflow). This can be done on a host with
node and git installed with:

```
$ git clone https://github.com/w3f/secure-validator
$ cd secure-validator
$ node . sync
```
You will need credentials as environment variables for all the infrastructure provider
used in the platform creation phase (AWS, Azure, GCP and packet).

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
also proteccted by a firewall that only allows connections on the VPN port.

## Workflow

The secure validator setup is structured in two layers, an underlaying platform
and the applications that run on top of it.

### Platform creation

Because of the different nature of the validator and the cloud nodes, the
platform is hybrid, consisting of a bare-metal machine and cloud instances.
However, we use terraform for creating both. The code for setting up the bare-
metal machine is in this repothey up is in [terraform-modules](/terraform-modules)
dir.

The cloud instances are created on 3 different cloud providers for increased
resiliency, and the bare-metal machine on packet.com. As part of the creation
process of the cloud instnaces we define hardware firewall to only allow access
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
    ExecStart=/usr/local/bin/polkadot \
            --name sv-public-0

    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

* Private node:

    * Start Polkadot service: the private node is started with the node's VPN address as part
    of the listen multiaddr and the multiaddr of the public nodes (with the peer id
    from the previous stage and the VPN addresses) as `reserved-nodes`. It looks like:

    ```
    [Unit]
    Description=Polkadot Node

    [Service]
    ExecStart=/usr/local/bin/polkadot \
            --name -sv-private \
            --validator \
            --listen-addr=/ip4/10.0.0.1/tcp/30333 \
            --reserved-nodes /ip4/10.0.0.2/tcp/30333/p2p/QmNpQbu2nKfHQMySnCue3XC9mAjBfzi8DQ9KvNwUM8jZdx \
            --reserved-nodes /ip4/10.0.0.3/tcp/30333/p2p/QmY81TLZKeNj4mGDAhFQE6RrHEJPidAkccgUTsJo7ifNFJ \
            --reserved-nodes /ip4/10.0.0.4/tcp/30333/p2p/QmTwMDJDnPyHUHV2fZFcVbNpYzp6Fu7LP6VhhK3Ei13iXr

    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```
