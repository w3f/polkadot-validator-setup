#!/bin/sh

# Prepare files
cat ./config/main.sample.json | sed 's/my_gcp_state_project/test-polkadot-benchmarks/g' | sed 's/my_packet_project/polkadot-benchmarks/g' | sed 's/my_gcp_project/polkadot-benchmarks/g' > config/main.json

# Provision
ssh-keygen -f public_keyfile -P "" -C "SSH_ID_RSA_PUBLIC"
ssh-add public_keyfile

ssh-keygen -f validator_keyfile -P "" -C "SSH_ID_RSA_VALIDATOR"
ssh-add validator_keyfile

# Install
#yarn sync -c config/main.json

# Test

# Destroy
#yarn clean -c config/main.json
