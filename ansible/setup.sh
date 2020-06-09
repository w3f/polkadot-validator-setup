#!/bin/bash

SUDO_PW=$1

if [ -z ${1+x} ]; then
  echo "Please set a sudo password for remote machines:"
  echo "  $ setup.sh <my_sudo_pw>"
  exit 1
fi

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

echo -n "### Finding validator hosts... "
out=$((ansible validator --list-hosts) 2>/dev/null)
if [[ $out == *"hosts (0)"* ]]; then
  out="No hosts found, exiting..."
  (exit 1)
  handle_error "$out"
else
  echo $out
fi

echo -n "### Finding public hosts... "
out=$((ansible public --list-hosts) 2>/dev/null)
if [[ $out == *"hosts (0)"* ]]; then
  out="No hosts found, exiting..."
  (exit 1)
  handle_error "$out"
else
  echo $out
fi

echo -n "### Testing connectivity to nodes... "
out=$((ansible all -m ping --become --extra-vars "ansible_become_pass=$SUDO_PW") 2>&1)
handle_error "$out"

echo "### Executing Ansible Playbook..."

ansible-playbook main.yml --become --extra-vars "ansible_become_pass=$SUDO_PW"

echo "### Done!"
