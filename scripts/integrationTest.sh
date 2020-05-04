#!/bin/sh

# Provision
pwd=$(pwd)

ssh-keygen -f public_keyfile -P "" -C "SSH_ID_RSA_PUBLIC" -m PEM
ssh-add public_keyfile
export SSH_ID_RSA_PUBLIC=$pwd/public_keyfile

ssh-keygen -f validator_keyfile -P "" -C "SSH_ID_RSA_VALIDATOR" -m PEM
ssh-add validator_keyfile
export SSH_ID_RSA_VALIDATOR=$pwd/validator_keyfile

# Install
yarn sync -c scripts/test.json

# Test
# Check ssh to validator port
# ssh root@nas01 uname -mrs
# Check ssh to pub ports
# ssh root@nas01 uname -mrs

# Check
# prometheus endpoint



# Destroy
#yarn clean -c scripts/test.json
