# Terraform Guide

This repo has code for creating a complete implementation of both layers
described in [Workflow](README.md/#workflow). This can be done on any host with
NodeJS, Yarn and Git installed.

### Prerequisites

Before using polkadot-secure-validator you need to have installed:

* NodeJS (we recommend using [nvm](https://github.com/nvm-sh/nvm))

* [Yarn](https://yarnpkg.com/lang/en/docs/install)

* [Terraform](https://www.terraform.io/downloads.html) (the snap package available via your package manager will not work)

* [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) (v2.8+, available through pip)

You will need credentials as environment variables for all the infrastructure providers
used in the platform creation phase. The tool now supports AWS, Azure, GCP and packet,
these are the required variables:

* AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` of an IAM account with EC2
and VPC write access.
* Azure: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`,
`ARM_TENANT_ID`, `TF_VAR_client_id` (same as `ARM_CLIENT_ID`),
`TF_VAR_client_secret` (same as `ARM_CLIENT_SECRET`). All these credentials
should correspond to a service principal with at least a `Contributor` role,
see [here](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal)
for details or [create an issue](https://github.com/w3f/polkadot-secure-validator/issues/new) for
finer grained access control.
* GCP: `GOOGLE_APPLICATION_CREDENTIALS` (path to json file with credentials of
the service account you want to use; this service account needs to have write
access to compute and network resources).
* PACKET: `TF_VAR_auth_token`.
* DigitalOcean: `TF_VAR_do_token`.

The tool allows you to specify which providers to use, so you don't need to have
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

You can easily create and add them to your ssh-agent as follows:

```bash
$ ssh-keygen -m PEM -f <path>
$ ssh-add <path>
```

### Synchronization

```
$ git clone https://github.com/w3f/secure-validator
$ cd secure-validator
$ yarn
$ cp config/main.template.json config/main.json
# now you should complete and customize config/main.json, using main.sample.json as a reference
$ yarn sync -c config/main.json
```

You can also just provision a set of previously created machines with the
[ansible code](ansible). We have provided an [example
inventory](ansible/inventory.sample) that you can customize. See the [Ansible
Guide](GUIDE_ANSIBLE.md) for more.

The `sync` command is idempotent, unless there are errors it will always have
the same results. You can execute it as much as you want, it will only make
changes when the actual infrastructure state doesn't match the desired state.

### Cleaning up

You can remove all the created infrastructure with:

```
$ yarn clean -c config/main.json
```
