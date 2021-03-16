#!/bin/sh

eval $(ssh-agent)
for key in $SSH_ID_ED25519_PUBLIC $SSH_ID_ED25519_VALIDATOR; do
    chmod 600 "$key"
    ssh-add "$key"
done

yarn

if [ ! -z "${POLKADOT_SECURE_VALIDATOR_CONFIG_FILE}" ]; then
    yarn sync -c "${POLKADOT_SECURE_VALIDATOR_CONFIG_FILE}"
else
    yarn sync
fi
