#!/bin/bash

# Periodically run the health_check

# Run using
# ROUTING_KEY="<pager_duty_routing_key>" ./start_monitoring.sh

# Check interval for checking the values
FREQUENCY_CHECK=30

while true
do
	/usr/local/bin/health-check.sh
	sleep $FREQUENCY_CHECK
done
