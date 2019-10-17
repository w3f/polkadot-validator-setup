import pytest
import yaml


@pytest.mark.parametrize("name", [
    ("vim-common"),
])
def test_packages(host, name):
    pkg = host.package(name)
    assert pkg.is_installed


def test_subkey_binary(host):
    binary = host.file('/usr/local/bin/subkey')
    assert binary.exists
    assert binary.user == 'root'
    assert binary.group == 'root'
    assert binary.mode == 0o777


def test_session_info(host):
    session_info = host.file('/home/polkadot/session.ksmcc2.yaml')

    assert session_info.exists

    Host = type(host)
    local = Host.get_host('local://')
    cmd = local.run('cat ./tests/expected.yaml')
    expected_contents_raw = cmd.stdout
    expected_contents = yaml.safe_load(expected_contents_raw)

    try:
        contents = yaml.safe_load(session_info.content_string)
        assert contents == expected_contents
    except yaml.YAMLError:
        assert False
