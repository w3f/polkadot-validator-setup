#!/bin/bash
set -e

# Provision
eval `ssh-agent -s`
ssh-add -D

teardown(){
    # Destroy
    yarn clean -c scripts/test.json
}

trap teardown EXIT

export SSH_ID_RSA_PUBLIC=$(pwd)/public_keyfile
export SSH_ID_RSA_VALIDATOR=$(pwd)/validator_keyfile
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/credentials.json

if [ -f "$SSH_ID_RSA_PUBLIC" ]; then
    echo "$SSH_ID_RSA_PUBLIC exist"
else
    echo "$SSH_ID_RSA_PUBLIC does not exist"
    ssh-keygen -f public_keyfile -P "" -C "SSH_ID_RSA_PUBLIC" -m PEM
fi
ssh-add public_keyfile

if [ -f "$SSH_ID_RSA_VALIDATOR" ]; then
    echo "$SSH_ID_RSA_VALIDATOR exist"
else
    echo "$SSH_ID_RSA_VALIDATOR does not exist"
    ssh-keygen -f validator_keyfile -P "" -C "SSH_ID_RSA_VALIDATOR" -m PEM
fi
ssh-add validator_keyfile
ssh-add -L

# Install
yarn plan -c scripts/test.json
yarn sync -c scripts/test.json
