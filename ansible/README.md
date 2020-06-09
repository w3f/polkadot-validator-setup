# Ansible Guide

This collection of Ansible scripts, so called "Playbooks", allow for the provisioning of all configured nodes. It automatically sets up the [Application layer workflow](../README.md/#application-creation) as specified by the [Secure Validator Setup](https://hackmd.io/QSJlqjZpQBihEU_ojmtR8g) approach.

The Ansible Playbook gets executed locally on your machine, then connects to the configured nodes and sets up the required tooling. Firewalls, VPN connections, Polkadot and all its dependencies are installed by issuing a single command. Not manual intervention into the remote nodes is required.

![Polkadot Validator-Sentry Model](polkadot-validator-sentry.svg)

## Prerequisites

### [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) (v2.8+)

On Debian-based systems this can be installed with `sudo apt install ansible` from the standard repositories.

### Running Debian-based nodes

The nodes require configured SSH access, but don't need any other preparatory work. It's up to you on how many node you want to use. General advice is to use one validator which connects to two or more sentries nodes. This setup assumes the remote users have `sudo` privileges with the same `sudo` password. Alternatively, [additional configuration](https://docs.ansible.com/ansible/latest/user_guide/become.html) is required.

It's recommended to setup SSH pubkey authentication for the nodes and to add the access keys to the SSH agent.

## Inventory

All required data is saved in a [Ansible inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html), which is placed under `/etc/ansible/hosts` and must only be configured once. Most default values from the [SAMPLE FILE](inventory.sample) can be copied. Only a handful of entries must be adjusted.

For each node, the following information must be configured in the Ansible inventory:

* IP address or URL.
* SSH user (as `ansible_user`). It's encouraged NOT to use `root`.
* A unique VPN address within the `10.0.0.0/24` network.
* (optional) The telemetry URL (e.g. `wss://telemetry.polkadot.io/submit/`).

The other default values from the example file can be left as is.

**NOTE**: VPN address should start at `10.0.0.1` for the validator and increment for each other (sentry) node: `10.0.0.2`, `10.0.0.3`, etc.

**NOTE**: Telemetry information exposes IP address, among other information. For this reason it's highly encouraged to use a [private telemetry server](https://github.com/paritytech/substrate-telemetry) and not to expose the validator to a public server.

### Setup Validator

Setup the validator node by specifying a `[validator-<NUM>]` host, including its required variables. `<NUM>` should start at `0` and increment for each other validator (assuming you have more than one validator).

Example:

```ini
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

Example:

```ini
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

```ini
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
* `polkadot_binary_url` - This is the URL from were the Ansible Playbook will download the Polkadot binary. Binary releases are available in the official [Parity Releases repo](https://github.com/paritytech/polkadot/releases) or the [W3F Releases repo](https://github.com/w3f/polkadot/releases).
* `polkadot_binary_checksum` - The SHA256 checksum of the Polkadot binary which the Ansible Playbook verifies. Must be prefixed with `sha256:`.
* `chain` - The chain to work on, such as `kusama` or `polkadot`.
* `polkadot_network_id` - The network identifier, such as `ksmcc2` (for Kusama) or `polkadot`.
* `node_exporter_enabled` - Enable or disable the setup of [Node Exporter](https://github.com/prometheus/node_exporter). It's up to you whether you want it or not.

The other default values from the example file can be left as is.

Example:

```ini
[all:vars]
# The name for how each node should be prefixed for the telemetry name
project=alice-in-wonderland

# Can be left as is.
ansible_ssh_common_args='-o StrictHostKeyChecking=no -o ConnectTimeout=15'
build_dir=$HOME/.config/polkadot-secure-validator/build/w3f/ansible

# Specify which `polkadot` binary to install. Checksum is verified during execution.
polkadot_binary_url='https://github.com/paritytech/polkadot/releases/download/v0.8.2/polkadot'
polkadot_binary_checksum='sha256:349b786476de9188b79817cab48fc6fc030908ac0e8e2a46a1600625b1990758'

# Specify the chain/network.
polkadot_network_id=polkadot
chain=polkadot

# Node exporter settings. Disabled by default.
node_exporter_enabled='false'
node_exporter_user='node_exporter_user'
node_exporter_password='node_exporter_password'
node_exporter_binary_url='https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-amd64.tar.gz'
node_exporter_binary_checksum='sha256:b2503fd932f85f4e5baf161268854bf5d22001869b84f00fd2d1f57b51b72424'

# Polkadot service restart settings. Enabled to restart every hour.
polkadot_restart_enabled='true'
polkadot_restart_minute='0'
polkadot_restart_hour='*'
polkadot_restart_day='*'
polkadot_restart_month='*'
polkadot_restart_weekday='*'
```

## Execution

Download the required files.
```bash
$ git clone https://github.com/w3f/polkadot-secure-validator.git
$ cd polkadot-secure-validator
```

Once the inventory file is configured, simply run the setup script and specify the `sudo` password for the remote machines.

```bash
$ chmod +x ansible/setup.sh
$ ./ansible/setup.sh my_sudo_pw
```

Alternatively, execute the Playbook manually ("become" implies `sudo` privileges).

```bash
$ ansible-playbook ansible/main.yml --become --ask-become
```

The `setup.sh` script handles some extra functionality, such as downloading the newest changes from upstream and checking connectivity of remote hosts including privilege escalation. This script/Playbook can be executed over and over again.

Additional Playbooks are provided besides `main.yml`, but those are outside the scope of this guide.

### Updating Polkadot

To update the Polkadot version, simply adjust those two lines in the Ansible inventory:

```ini
polkadot_binary_url='...'
polkadot_binary_checksum='sha256:...'
```

Then just execute `setup.sh` again.

### Ansible Playbooks