#!/bin/bash

function handle_error() {
  if (( $? )) ; then
    echo -e "[\e[31mERROR\e[39m]"
    echo -e >&2 "CAUSE:\n" $1
    exit 1 
  else
    echo -e "[\e[32mOK\e[39m]"
  fi
}

cd "$(dirname "$0")"

echo -n "### Pulling upstream changes... "
out=$((git pull origin master) 2>&1)
handle_error "$out"

echo -n "### Testing Ansible availability... "
out=$((ansible --version) 2>&1)
handle_error "$out"

echo -n "### Finding hosts... "
out=$((ansible all --list-hosts) 2>/dev/null)
if [[ $out == *"hosts (0)"* ]]; then
  out="No hosts found, exiting..."
  (exit 1)
  handle_error "$out"
else
  echo $out
fi

echo -n "### Testing connectivity to nodes... "
out=$((ansible all -m ping) 2>&1)
handle_error "$out"

echo "### Executing Ansible Playbook..."

#ansible-playbook main.yml

echo "### Done!"

