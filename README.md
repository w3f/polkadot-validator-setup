[![CircleCI](https://circleci.com/gh/w3f/polkadot-secure-validator.svg?style=svg)](https://circleci.com/gh/w3f/polkadot-secure-validator)

# Polkadot Secure Validator Setup

This repo describes a potential setup for a Polkadot validator that aims to
prevent some types of potential attacks at the TCP layer.
The [Workflow](#workflow) section describes the [Platform Layer](#platform-layer)
and the [Application Layer](#application-layer) in more detail.

## Usage

There are two ways of using this repository:

* **Platform & Application Layer**

  Configure credentials for infrastructure providers such as AWS, Azure, GCP
  and/or Packet, then execute the Terraform process to automatically deploy the
  required machines ([Platform Layer](#platform-layer)) and setup the
  [Application Layer](#application-layer).

  See the [Complete Guide](GUIDE_COMPLETE.md) for more.

* **Application Layer**

  Setup Debian-based machines yourself, which only need basic SSH access and
  configure those in an inventory. The Ansible scripts will setup the entire
  [Application Layer](#application-layer).

  See the [Ansible Guide](GUIDE_ANSIBLE.md) for more.

## Structure

The secure validator setup is composed of one or more validators that run a local
instance of NGINX as a reverse TCP proxy. The validators are instructed to:
* advertise themselves with the public IP of the node and the port where the
reverse proxy is listening.
* bind to the localhost interface, so that they only allow connections from the
proxy.

The setup also configures a firewall in which the default p2p ports are closed for
incoming connections and only the proxy port is open.

## Workflow

The secure validator setup is structured in two layers, an underlying platform
and the applications that run on top of it.

### Platform Layer

Validatorsare created using the terraform modules located at [terraform](/terraform)
directory. We have created code for several providers but it is possible to add new
ones, please reach out if you are interested in any provider currently not available.

Besides the actual machines the terraform modules create the minimum required networking
infrastructure for adding firewall rules to protect the nodes.

### Application Layer

This is done through the ansible playbook and polkadot-validator role located at
[ansible](/ansible), basically the role performs this actions:

* Software firewall setup, for the validator we only allow the proxy, SSH and, if
enabled, node-exporter ports.
* Configure journald to tune log storage.
* Create polkadot user and group.
* Configure NGINX proxy
* Setup polkadot service, including binary download.
* Polkadot session management, create session keys if they are not present.
* Setup node-exporter if the configuration includes it.
