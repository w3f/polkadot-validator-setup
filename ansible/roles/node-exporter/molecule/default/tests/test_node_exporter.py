import pytest


@pytest.mark.parametrize("name", [
    ("nginx"),
    ("apache2-utils")
])
def test_packages(host, name):
    pkg = host.package(name)
    assert pkg.is_installed


def test_htpasswd(host):
    htpasswd = host.file("/etc/nginx/.htpasswd")
    assert htpasswd.exists
    assert htpasswd.user == 'www-data'
    assert htpasswd.group == 'www-data'
    assert htpasswd.mode == 0o600


def test_nginx_config(host):
    cfg = host.file("/etc/nginx/sites-enabled/node-exporter.conf")
    assert cfg.exists
    assert cfg.user == 'root'
    assert cfg.group == 'root'
    assert cfg.mode == 0o644
    assert cfg.contains('proxy_pass http://localhost:9101/;')
    assert cfg.contains('auth_basic_user_file ".htpasswd";')


def test_nginx_running_and_enabled(host):
    nginx = host.service("nginx")
    assert nginx.is_running
    assert nginx.is_enabled


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
