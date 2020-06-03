# Ansible Guide

This collection of Ansible scripts allows for privisioning of all registered nodes.

## Prerequisites

* [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) (v2.8+, available through pip)

## Inventory

All required data is configured in the [Ansible inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html), which is placed under `/etc/ansible/hosts`. Most default values from the [sample file](inventory.sample) can be copied. Only a handful of entries must be adjusted.

It's up to you on how many servers you want to use. General advice is to use one validator which connects to two or more sentries nodes. For each server, the following information must be available in the Ansible inventory:

* IP address or URL.
* SSH user (as `ansible_user`). It's encouraged NOT to use `root`.
* VPN address.
* (optional) The telemetry URL (e.g. `wss://telemetry.polkadot.io/submit/`)

The other default values from the example can be left as is.

**NOTE**: VPN address should start at `10.0.0.1` for the validator and increment for each other (sentry) node: `10.0.0.2`, `10.0.0.3`, etc.

**NOTE**: Telemetry information exposes IP address, among other information. For this reason it's highly encouraged to use a [private telemetry server](https://github.com/paritytech/substrate-telemetry) and not to expose the validator to a public one server.

### Setup Validator

Setup the validator node by specifying a `[validator-<NUM>]` host, including its required variables. `<NUM>` should start at `0` and increment for each other validator (assuming you use more than one validator).

Example:

```
[validator-0]
147.75.76.65

[validator-0:vars]
ansible_user=ubuntu_user
vpnpeer_address=10.0.0.1
vpnpeer_cidr_suffix=24
telemetryUrl=wss://mi.private.telemetry.backend/
loggingFilter='sync=trace,afg=trace,babe=debug'
```

### Setup Sentries

Setup one or multiple sentry nodes by specifying a `[public-<NUM>]` host, including its required variables. `<NUM>` should start at `0` and increment for each other sentry.

Example

```
[public-0]
18.184.100.247

[public-0:vars]
ansible_user=ubuntu_user
vpnpeer_address=10.0.0.2
vpnpeer_cidr_suffix=24
telemetryUrl=wss://mi.private.telemetry.backend/
loggingFilter='sync=trace,afg=trace,babe=debug'

[public-1]
40.81.189.214

[public-1:vars]
ansible_user=ubuntu_user
vpnpeer_address=10.0.0.3
vpnpeer_cidr_suffix=24
telemetryUrl=wss://mi.private.telemetry.backend/
loggingFilter='sync=trace,afg=trace,babe=debug'
```

### Grouping Validators and Sentries

The Ansible scripts must know about all the nodes required for validation. Since Validators and Sentries must be configured differently, two specific groups must be created.

Validators are grouped under `[validators:children]` and sentries under `[public:children]`.

Example:

```
[validator:children]
validator-0

[public:children]
public-0
public-1
```

### Specify common variables

Finally, define the common variables for all the nodes.

Important variables which should vary from the example inventory:

* `project` - The name for how each node should be prefixed for the telemetry name.
* `polkadot_binary_url` - This is the URL from which were the Ansible Playbook will download the Polkadot binary. Binary releases are available in the official [Parity Releases repo](https://github.com/paritytech/polkadot/releases) or the [W3F Releases repo](https://github.com/w3f/polkadot/releases).
* `polkadot_binary_checksum` - The SHA256 checksum of the Polkadot binary which the Ansible Playbook verifies. must be prefixed with `sha256:`.
* `chain` - The chain which Polkadot should work on, such as `kusama` or `polkadot`.
* `polkadot_network_id` - The network identifier, such as `ksmcc2` (for Kusama) or `polkadot`.
* `node_exporter_enabled` - Enable or disable the setup of [Node Exporter](https://github.com/prometheus/node_exporter). It's up to you whether you want it or not.

The other default values from the example can be left as is.

Example:

```
project=w3f
ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ConnectTimeout=15'
polkadot_binary_url='https://github.com/paritytech/polkadot/releases/download/v0.8.2/polkadot'
polkadot_binary_checksum='sha256:349b786476de9188b79817cab48fc6fc030908ac0e8e2a46a1600625b1990758'
polkadot_network_id=ksmcc2
chain=kusama
build_dir=/home/user/.config/polkadot-secure-validator/build/w3f/ansible
node_exporter_enabled='true'
node_exporter_user='node_exporter_user'
node_exporter_password='node_exporter_password'
node_exporter_binary_url='https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-amd64.tar.gz'
node_exporter_binary_checksum='sha256:b2503fd932f85f4e5baf161268854bf5d22001869b84f00fd2d1f57b51b72424'
polkadot_restart_enabled='true'
polkadot_restart_minute='50'
polkadot_restart_hour='10'
polkadot_restart_day='1'
polkadot_restart_month='*'
polkadot_restart_weekday='*'
```