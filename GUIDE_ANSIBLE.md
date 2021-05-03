# Ansible Guide

This repo contains collections of Ansible scripts inside the [ansible/](ansible)
directory, so called "Roles", which are responsible for the provisioning of
all configured nodes. It automatically sets up the [Application
Layer](README.md/#application-layer) and manages updates for Polkadot
software releases.

There is a main Ansible Playbook that orchestrates all the roles, it gets
executed locally on your machine, then connects to the configured nodes and sets
up the required tooling. Firewalls, Polkadot nodes and all its dependencies are
installed by issuing a single command. No manual intervention into the remote
nodes is required.

## Prerequisites

* [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
  (v2.8+)

  On Debian-based systems this can be installed with `sudo apt install ansible`
  from the standard repositories.

* Running Debian-based nodes

  The nodes require configured SSH access, but don't need any other preparatory
  work. It's up to you on how many nodes you want to use. This setup assumes the
  remote users have `sudo` privileges with the same `sudo` password.
  Alternatively, [additional
  configuration](https://docs.ansible.com/ansible/latest/user_guide/become.html)
  is required.

It's recommended to setup SSH pubkey authentication for the nodes and to add the
access keys to the SSH agent.

## Inventory

All required data is saved in a [Ansible
inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html),
which by default is placed under `/etc/ansible/hosts` (but you can create it
anywhere you want) and must only be configured once. Most values from the
[SAMPLE FILE](ansible/inventory.sample) can be copied. Only a handful of entries
must be adjusted.

For each node, the following information must be configured in the Ansible
inventory:

* IP address or URL.
* SSH user (as `ansible_user`). It's encouraged NOT to use `root`.
* (optional) The telemetry URL (e.g. `wss://telemetry.polkadot.io/submit/`,
  where the info can then be seen under https://telemetry.polkadot.io).
* (optional) The logging filter.

The other default values from the sample inventory can be left as is.

**NOTE**: Telemetry information exposes IP address, among other information. For
this reason it's highly encouraged to use a [private telemetry
server](https://github.com/paritytech/substrate-telemetry) and not to expose the
validator to a public server.

### Setup Validator

Setup the validator node by specifying a `[validator_<NUM>]` host, including its
required variables. `<NUM>` should start at `0` and increment for each other
validator (assuming you have more than one validator).

Example:

```ini
[validator_0]
147.75.76.65

[validator_0:vars]
ansible_user=alice
telemetryUrl=wss://telemetry.polkadot.io/submit/
loggingFilter='sync=trace,afg=trace,babe=debug'

[validator_1]
162.12.35.55

[validator_1:vars]
ansible_user=bob
telemetryUrl=wss://telemetry.polkadot.io/submit/
loggingFilter='sync=trace,afg=trace,babe=debug'
```

### Grouping Validators

All nodes to be setup must be grouped under `[validator:children]`.

Example:

```ini
[validator:children]
validator_0
validator_1
```

### Specify common variables

Finally, define the common variables for all the nodes.

Important variables which should vary from the [sample inventory](ansible/inventory.sample):

* `project` - The name for how each node should be prefixed for the telemetry
  name.
* `polkadot_binary_url` - This is the URL from were Ansible will
  download the Polkadot binary. Binary releases are available in the official
  [Parity Releases repo](https://github.com/paritytech/polkadot/releases) or the
  [W3F Releases repo](https://github.com/w3f/polkadot/releases).
* `polkadot_binary_checksum` - The SHA256 checksum of the Polkadot binary which
  Ansible verifies during execution. Must be prefixed with `sha256:`.
* `chain` - The chain to work on, such as `kusama` or `polkadot`.
* `polkadot_network_id` - The network identifier, such as `ksmcc3` (for Kusama)
  or `polkadot`.
* `node_exporter_enabled` - Enable or disable the setup of [Node
  Exporter](https://github.com/prometheus/node_exporter). It's up to you whether
  you want it or not.

The other default values from the sample inventory can be left as is.

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

# Nginx authentication settings.
nginx_user='prometheus'
nginx_password='nginx_password'

# Node exporter settings. Disabled by default.
node_exporter_enabled='false'
node_exporter_binary_url='https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-amd64.tar.gz'
node_exporter_binary_checksum='sha256:b2503fd932f85f4e5baf161268854bf5d22001869b84f00fd2d1f57b51b72424'

# Polkadot service restart settings. Enabled to restart every hour.
polkadot_restart_enabled='true'
polkadot_restart_minute='0'
polkadot_restart_hour='*'
polkadot_restart_day='*'
polkadot_restart_month='*'
polkadot_restart_weekday='*'

# Optional: Restore the chain db from a .7z snapshot
polkadot_db_snapshot_url='https://ksm-rocksdb.polkashots.io/kusama-6658753.RocksDb.7z'
polkadot_db_snapshot_checksum='sha256:4f61a99e4b00acb335aff52f2383880d53b30617c0ae67ac47c611e7bf6971ff'
```

## Execution

Download the required files.

```console
user@pc:~$ git clone https://github.com/w3f/polkadot-secure-validator.git
user@pc:~$ cd polkadot-secure-validator/ansible
```

Once the inventory file is configured, simply run the setup script and specify
the `sudo` password for the remote machines.

**NOTE**: If no inventory path is specified, it will try to look for
`ansible/inventory.yml` by default.

```console
user@pc:~/polkadot-secure-validator/ansible$ chmod +x setup.sh
user@pc:~/polkadot-secure-validator/ansible$ ./setup.sh my_inventory.yml
Sudo password for remote servers:
>> Pulling upstream changes... [OK]
>> Testing Ansible availability... [OK]
>> Finding validator hosts... [OK]
  hosts (2):
    147.75.76.65
    162.12.35.55
>> Testing connectivity to hosts... [OK]
>> Executing Ansible Playbook...

...
```

Alternatively, execute the Playbook manually ("become" implies `sudo`
privileges).

```console
user@pc:~/polkadot-secure-validator/ansible$ ansible-playbook -i my_inventory.yml main.yml --become --ask-become
```

The `setup.sh` script handles some extra functionality, such as downloading the
newest upstream changes and checking connectivity of remote hosts including
privilege escalation. This script/Playbook can be executed over and over again.

Additional Playbooks are provided besides `main.yml`, but those are outside the
scope of this guide.

### Updating Polkadot

To update the Polkadot version, simply adjust those two lines in the Ansible
inventory:

```ini
polkadot_binary_url='...'
polkadot_binary_checksum='sha256:...'
```

Then just execute `setup.sh` again.
