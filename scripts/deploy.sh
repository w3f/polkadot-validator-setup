#!/bin/sh

eval $(ssh-agent)
for key in $SSH_ID_RSA_PUBLIC1 $SSH_ID_RSA_PUBLIC2 $SSH_ID_RSA_PUBLIC3 $SSH_ID_RSA_VALIDATOR; do
    chmod 600 "$key"
    ssh-add "$key"
done

yarn

yarn sync
