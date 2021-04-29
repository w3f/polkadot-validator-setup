Prometheus
=========

Deploy a prometheus instance for monitoring your node stats.
Later you can link it up as a source in Grafana for better visualisation.

Requirements
------------

- polkadot node with an open port to prometheus
- node_exporter installed and running for collection of machine metrics

Role Variables
--------------

The url and the checksum for the prometheus binary. Can be found on the official release page: https://github.com/prometheus/prometheus/releases

```
prometheus_binary_url
prometheus_binary_checksum
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
