import pytest


@pytest.mark.parametrize("name,version", [
    ("vpncloud", "1.0.0"),
])
def test_packages(host, name, version):
    pkg = host.package(name)
    assert pkg.is_installed
    assert pkg.version.startswith(version)
