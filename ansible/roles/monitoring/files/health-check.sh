#!/bin/bash

set -u

# This scripts need to be supplied with env variables
# `ROUTING_KEY` - Pager duty routing key

# Pager duty source identifier
CENT_ENV=${CENT_ENV:-"unknown"}
SOURCE_NODE=${SOURCE_NODE:-"node:monitoring"}
SOURCE="${CENT_ENV}:${SOURCE_NODE}"

# Prometheus address endpoint
PROMETHEUS_ENDPOINT="127.0.0.1:9615"
# File to store the block information for checking change in the subsequent call
BLOCK_INFO_STORE="/tmp/centrifuge_block_info.json"
# If the block is not changed for 1 minute, then send an alert
# Make sure the call frequency is less than MAX_DURATION/2 to get rid false positives alerts
MAX_DURATION=60

echo "Trigger for Source ${SOURCE}"

# Send message to pager duty
# Documents in:
# https://v2.developer.pagerduty.com/v2/docs/send-an-event-events-api-v2
function send_to_pager_duty(){
	payload=$1
	reply=$( curl -s -H "Content-Type: application/json" -d "${payload}" -X POST "https://events.pagerduty.com/v2/enqueue" )
	echo -e "${reply}" | jq -r '.status'
}

# Send message to pager_duty
# argument 1 is message
# argument 2 is severity
function send_message(){
	message=$1
	severity=$2
	payload="{\"routing_key\":\"${ROUTING_KEY}\",\"event_action\":\"trigger\",\"payload\":{\"summary\":\"${message}\",\"source\":\"${SOURCE}\",\"severity\":\"${severity}\"}}"
	send_to_pager_duty "${payload}"
}

# Send a regular info message to pager_duty
function send_info_message(){
	send_message "$1" "info"
}

# Send a critical alert message to pager_duty
function send_critical_message(){
	send_message "$1" "critical"
}

if [ ! -f $BLOCK_INFO_STORE ]; then
    touch $BLOCK_INFO_STORE
fi

# Get the data from prometheus endpoint
metrics=$( curl -s "http://${PROMETHEUS_ENDPOINT}/metrics" )
if [[ $? != 0 ]]
then
    reply=$(send_critical_message "Node Exporter endpoint not available, app might be down")
		if [[ "${reply}" == "success" ]]
		then
			echo "Critical message send: OK"
		else
			echo "Warning: Unable to send critical message to PagerDuty"
		fi
fi

if [[ $metrics == "" ]]
then
  reply=$(send_critical_message "Cannot gather metrics from node exporter endpoint")
		if [[ "${reply}" == "success" ]]
		then
			echo "Critical message send: OK"
		else
			echo "Warning: Unable to send critical message to PagerDuty"
		fi
fi

# The timestamp we get the data from prometheus endpoint
timestamp=$(date +%s)

# Extract the info exposed from prometheus endpoint data
block_height_best=$(echo "${metrics}" | sed -n -r "s/^substrate_block_height_number\{status=\"best\"\} ([0-9]+)$/\1/p")
block_height_finalized=$(echo "${metrics}" | sed -n -r "s/^substrate_block_height_number\{status=\"finalized\"\} ([0-9]+)$/\1/p")
block_height_sync_target=$(echo "${metrics}" | sed -n -r "s/^substrate_block_height_number\{status=\"sync_target\"\} ([0-9]+)$/\1/p")
cpu_usage=$(echo "${metrics}" | sed -n -r "s/^substrate_cpu_usage_percentage ([0-9.]+)$/\1/p")
memory_usage=$(echo "${metrics}" | sed -n -r "s/^substrate_memory_usage_bytes ([0-9]+)$/\1/p")
network_download=$(echo "${metrics}" | sed -n -r "s/^substrate_network_per_sec_bytes\{direction=\"download\"\} ([0-9]+)$/\1/p")
network_upload=$(echo "${metrics}" | sed -n -r "s/^substrate_network_per_sec_bytes\{direction=\"upload\"\} ([0-9]+)$/\1/p")
peers_count=$(echo "${metrics}" | sed -n -r "s/^substrate_peers_count ([0-9]+)$/\1/p")
transactions=$(echo "${metrics}" | sed -n -r "s/^substrate_ready_transactions_number ([0-9]+)$/\1/p")

message="block_height_best: ${block_height_best}\n\
block_height_finalized: ${block_height_finalized}\n\
block_height_sync_target: ${block_height_sync_target}\n\
cpu_usage: ${cpu_usage}\n\
memory_usage: ${memory_usage}\n\
network download: ${network_download}\n\
network upload: ${network_upload}\n\
peers_count: ${peers_count}\n\
transactions: ${transactions}"

echo "message: ${message}"

last_block_info=$(cat $BLOCK_INFO_STORE )
echo "last_block_info: ${last_block_info}"
block_info="{ \"block_height_best\":${block_height_best}, \"block_height_finalized\": ${block_height_finalized}, \"block_height_sync_target\": ${block_height_sync_target}, \"timestamp\": ${timestamp} }"
echo "block info: ${block_info}"


last_finalized_block=$(echo ${last_block_info} | jq '.block_height_finalized')
last_change=$(echo ${last_block_info} | jq '.timestamp')
echo "last_finalized_block: ${last_finalized_block}"
echo "last_change: ${last_change}"

# Store only the block info here only when it has changed
if [[ ${last_finalized_block} != ${block_height_finalized} ]]
then
	echo "$block_info" > $BLOCK_INFO_STORE
fi

duration_since_changed=$(( ${timestamp} - ${last_change} ))
echo "Duration since changed: ${duration_since_changed}"

if [[ ${last_finalized_block} == ${block_height_finalized} ]]
then
	critical_message="Block ${block_height_finalized} has not changed since last checked"
	echo "${critical_message}"

	if (( ${duration_since_changed} > ${MAX_DURATION} ))
	then
		echo "CRITICAL: ---> Sending alert message"
		reply=$(send_critical_message "${critical_message}")
		if [[ "${reply}" == "success" ]]
		then
			echo "Critical message send: OK"
		else
			echo "Warning: Unable to send critical message to PagerDuty"
		fi
	fi
fi



#reply=$(send_info_message "${message}")
#if [[ "${reply}" == "success" ]]
#then
#	echo "Message send: OK"
#else
#	echo "Warning: Unable to send message to PagerDuty"
#fi
