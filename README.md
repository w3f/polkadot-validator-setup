# Structure

The secure validator setup is composed of a bare-metal machine that runs the
actual validator and a set of cloud nodes connected to it. The validator is
isolated from the internet and only has access to the polkadot network through
the cloud nodes, which are accessible from the internet and are connected to
the rest of the polkadot network.

The connection between the validator node and the cloud nodes is performed
defining a VPN to which all these nodes belong. The polkadot instance running in
the validator node is configured to only listen on the VPN-attached interface,
and uses the cloud node's VPN address in the `--external-nodes` parameter. It is
also proteccted by a firewall that only allows connections on the VPN port.

# Workflow

The secure validator setup is structured in two layers, an underlaying platform
and the applications that run on top of it.

## Platform creation

Because of the different nature of the validator and the cloud nodes, the
platform is hybrid, consisting of a bare-metal machine and cloud instances.
However, we use terraform for creating both. The code for setting up the bare-
metal machine is in this repo (`terraform-modules` dir) and we rely on polkadot-
deployer for creating the required cloud resources for the public nodes.

## Application creation

This will be different depending on the role of the instances:

* Validator: we provision the server machine using ansible in 3 phases:

    - creation of VPN public and private keys.

    - retrieval of public VPN keys from cloud nodes.

    - final setup: VPN configuration, polkadot configuration and service
    creation, firewall configuration, root password setup, SSH server removal.

* Public nodes: once the kubernetes clusters are created we deploy the polkadot
nodes using a Helm chart, first we need to know the validator VPN public key and IP.
