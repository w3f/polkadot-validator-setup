def test_node_exporter(host):
    binary = host.file("/usr/local/bin/node_exporter")
    assert binary.exists
    assert binary.user == 'root'
    assert binary.group == 'root'
    assert binary.mode == 0o755


def test_node_exporter_unit(host):
    unit = host.file("/etc/systemd/system/node_exporter.service")
    assert unit.exists
    assert unit.user == 'root'
    assert unit.group == 'root'
    assert unit.mode == 0o600
    assert unit.contains('--web.listen-address="localhost:9101"')


def test_node_exporter_running_and_enabled(host):
    nginx = host.service("node_exporter")
    assert nginx.is_running
    assert nginx.is_enabled
