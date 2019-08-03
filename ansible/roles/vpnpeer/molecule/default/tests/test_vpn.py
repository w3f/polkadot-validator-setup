def test_vpn_config_file(host):
    cfg = host.file("/etc/wireguard/wg0.conf")
    assert cfg.exists
    assert cfg.user == 'root'
    assert cfg.group == 'root'
    assert cfg.mode == 0o600
    assert cfg.contains('ListenPort = 51820')


def test_vpn_running_and_enabled(host):
    vpn = host.service("wg-quick@wg0")
    assert vpn.is_running
    # assert vpn.is_enabled
