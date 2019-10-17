import yaml


def test_subkey_binary(host):
    binary = host.file('/usr/local/bin/subkey')
    assert binary.exists
    assert binary.user == 'root'
    assert binary.group == 'root'
    assert binary.mode == 0o777


def test_session_info(host):
    session_file_path = '/home/polkadot/session.yaml'
    session_info = host.file(session_file_path)

    assert session_info.exists

    local = host.Host.get_host('local://')
    cmd = local.run('cat expected.yaml')
    expected_contents_raw = cmd.out
    expected_contents = yaml.safe_load(expected_contents_raw)

    with open(session_file_path, 'r') as stream:
        try:
            contents = yaml.safe_load(stream)
            assert contents == expected_contents
        except yaml.YAMLError:
            assert False
