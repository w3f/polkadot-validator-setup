Role Name
=========

A brief description of the role goes here.

Requirements
------------

No  pre-requisites.

Role Variables
--------------

Chain to use for the validator, example `kusama` which is an early, unaudited and unrefined release of Polkadot. Kusama will serve as a proving ground, allowing teams and developers to build and deploy a parachain or try out Polkadot’s governance, staking, nomination and validation functionality in a real environment.

```
chain: kusama
```

Project specified to start in the service file, if not set, defaults to `project`.

```
 project
```

Dependencies
------------

Example Playbook
----------------

    - hosts: validator
      become: yes
      roles:
      - polkadot-validator

License
-------

BSD

Author Information
------------------

An optional section for the role authors to include contact information, or a
website (HTML is not allowed).
