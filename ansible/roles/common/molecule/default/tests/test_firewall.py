import pytest


@pytest.mark.parametrize("name,version", [
    ("ufw", "0.36"),
])
def test_packages(host, name, version):
    pkg = host.package(name)
    assert pkg.is_installed
    assert pkg.version.startswith(version)
