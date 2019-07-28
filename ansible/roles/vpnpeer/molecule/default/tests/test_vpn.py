import pytest


@pytest.mark.parametrize("name,version", [
    ("vpncloud", "1.0.0"),
])
def test_packages(host, name, version):
    pkg = host.package(name)
    assert pkg.is_installed
    assert pkg.version.startswith(version)


def test_vpn_config_file(host):
    cfg = host.file("/etc/vpncloud/default.net")
    assert cfg.exists
    assert cfg.user == 'root'
    assert cfg.group == 'root'
    assert cfg.mode == 0o600
    assert cfg.contains('crypto: aes256')
    assert cfg.contains('ifup: "ifconfig $IFNAME 10.0.0.1/24 mtu 1400"')


def test_vpn_running_and_enabled(host):
    vpn = host.service("vpncloud@default")
    assert vpn.is_running
    assert vpn.is_enabled
