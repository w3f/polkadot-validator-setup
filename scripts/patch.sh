#!/bin/bash
set -e


echo patching...
result=$(cat config/main.json | jq '.polkadotBinary.url = "'${url}'"') && echo "${result}" > config/main.sample.json
result=$(cat config/main.json | jq '.polkadotBinary.checksum = "'${checksum}'"') && echo "${result}"  > config/main.sample.json

result=$(cat config/main.json | jq '.polkadotBinary.url = "'${url}'"') && echo "${result}" > scripts/binaryUpgradeTest.json
result=$(cat config/main.json | jq '.polkadotBinary.checksum = "'${checksum}'"') && echo "${result}"  > scripts/binaryUpgradeTest.json
