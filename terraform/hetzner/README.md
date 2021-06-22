# Hetzner specific deployment

### Ansible user setup

The included script `setup_users.sh` will create a `ssh_user` user with the specified password hash. This password can also be used when applying the ansible playbook with:

`ansible-playbook main.yml --become --extra-vars "ansible_become_pass='$SUDO_PW'"`

The password hash can be obtained by running:
`openssl passwd -6` on linux machines (input should be SUDO_PW)

### Hcloud token

You need to create a Hetzner API token to be able to use their service. Follow the [official docs](https://docs.hetzner.cloud/).

### SSH Keys
Hetzner won't let you deploy the same key twice (no override), which becomes problematic during re-applying the state.

You should do that independently by creating the ssh key locally & uploading to your Hetzner console. Make sure that `public_key_name` (Name) & `public_key` (SSH Key) match.

### Terraform variables

It is recommended that you specify your Hetzner variables as env variables, e.g.
```
export TF_VAR_public_key="ssh-rsa..."
export TF_VAR_public_key_name="<keyname@email.com>"
export TF_VAR_hcloud_token="<your token>"
export TF_VAR_password_hash="<password hash for ansible user>"
```
