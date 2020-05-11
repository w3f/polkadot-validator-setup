import pytest


@pytest.mark.parametrize("name", [
    ("wireguard"),
])
def test_packages(host, name):
    pkg = host.package(name)
    assert pkg.is_installed


def test_privatekey(host):
    privatekey = host.file("/etc/wireguard/privatekey")
    assert privatekey.exists
    assert privatekey.user == 'root'
    assert privatekey.group == 'root'
    assert privatekey.mode == 0o600


def test_publickey(host):
    publickey = host.file("/etc/wireguard/publickey")
    assert publickey.exists
    assert publickey.user == 'root'
    assert publickey.group == 'root'
    assert publickey.mode == 0o600
