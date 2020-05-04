#!/bin/sh

# Provision
ssh-keygen -f public_keyfile -P "" -C "SSH_ID_RSA_PUBLIC"
ssh-add public_keyfile

ssh-keygen -f validator_keyfile -P "" -C "SSH_ID_RSA_VALIDATOR"
ssh-add validator_keyfile

# Install
yarn sync -c scripts/test.json

# Test

# Destroy
#yarn clean -c scripts/test.json
