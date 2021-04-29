Prometheus
=========

Deploy a prometheus instance for monitoring your node stats.
Later you can link it up as a source in Grafana for better visualisation.

It is recommended that polkadot and prometheus run on different physical machines. The firewall of your polkadot instance should only allow access from the prometheus IP. This is done automatically in the `main.yml` playbook, by:
- first, deploying polkadot (`validator` role)
- second, deploying prometheus (`prometheus` role)
- once we know **where** prometheus is deployed, closing the metrics collection ports on the polkadot to the public, but opening the prometheus' IP (`validator` role again)

Also, see `firewall_prometheus.yml` which is run for the validator role

Prometheus, on the other hand, is a non-critical piece of infrastructure, so its ports can be accessible to the public (feel free to add an extra layer of selective firewalls and/or authentication). 

Requirements
------------

- polkadot node with an open port to prometheus. If polkadot & prometheus are on the same node, you don't need to change anything, as polkadot will allow access to its metrics on 9615. In case you run prometheus on a different machine (recommended), you need to add `--prometheus-external` to the `polkadot.service` file
- node_exporter installed and running for collection of machine metrics

Role Variables
--------------

The url and the checksum for the prometheus binary. Can be found on the official release page: https://github.com/prometheus/prometheus/releases

```
prometheus_binary_url=...
prometheus_binary_checksum=...
```

Example Playbook
----------------

    - hosts: prometheus
      become: yes
      roles:
      - prometheus

License
-------

BSD

Author Information
------------------

Marcin Górny
https://github.com/mmagician
