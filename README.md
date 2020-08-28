[![CircleCI](https://circleci.com/gh/w3f/polkadot-secure-validator.svg?style=svg)](https://circleci.com/gh/w3f/polkadot-secure-validator)

# Polkadot Secure Validator Setup

This repo describes a potential setup for a Polkadot validator that aims to
prevent some types of potential attacks at the TCP layer and below.
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

The secure validator setup is composed of one or more validators that run with a local
instance of NGINX as a reverse TCP proxy in front of them. The validators are instructed to:
* advertise themselves with the public IP of the node and the port where the
reverse proxy is listening.
* bind to the localhost interface, so that they only allow incoming connections from the
proxy.

The setup also configures a firewall in which the default p2p port is closed for
incoming connections and only the proxy port is open.

## Workflow

The secure validator setup is structured in two layers, an underlying platform
and the applications that run on top of it.

### Platform Layer

Validators are created using the terraform modules located at [terraform](/terraform)
directory. We have created code for several providers but it is possible to add new
ones, please reach out if you are interested in any provider currently not available.

Besides the actual machines the terraform modules create the minimum required networking
infrastructure for adding firewall rules to protect the nodes.

### Application Layer

This is done through the ansible playbook and polkadot-validator role located at
[ansible](/ansible), basically the role performs these actions:

* Software firewall setup, for the validator we only allow the proxy, SSH and, if
enabled, node-exporter ports.
* Configure journald to tune log storage.
* Create polkadot user and group.
* Configure NGINX proxy
* Setup polkadot service, including binary download.
* Polkadot session management, create session keys if they are not present.
* Setup node-exporter if the configuration includes it.

# Note about upgrades from the sentries setup

The current version of polkadot-secure-validator doesn't allow to create and configure
sentry nodes. Although the terraform files and ansible roles of this latest version
can be applied on setups created with previous versions, the validators would be configured
to work without sentries and to connect to the network using the local reverse proxy instead.

If you created the sentries with a previous version of this tool through terraform following
the complete workflow, then they will not be deleted automatically when running this new version.
In short, the old sentries will no longer be used by the validators and it will be up to you to
remove them manually.
