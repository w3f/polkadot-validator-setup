#! /bin/bash

# TODO Change to -M and nologin?
useradd -Ds /bin/bash
useradd -m -G sudo ${user} -p '${password_hash}' | true

mkdir -p /home/${user}/.ssh

chown -R ${user}:${user} /home/${user}/.ssh 

echo ${public_key} >> /home/${user}/.ssh/authorized_keys
