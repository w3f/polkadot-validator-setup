def test_subkey_binary(host):
    binary = host.file('/usr/local/bin/subkey')
    assert binary.exists
    assert binary.user == 'root'
    assert binary.group == 'root'
    assert binary.mode == 0o777
