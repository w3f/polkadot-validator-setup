import cmd from '../cmd';

describe('Command splitting', () => {
  it('preserves args with spaces in but in quotes', () => {
    const result = cmd.splitCommandAndArgs(
      'ansible-playbook main.yml -f 30 -i "/Users/user/Library/Application Support/polkadot-secure-validator/build/w3f/ansible/inventory"',
    );

    expect(result).toEqual([
      'ansible-playbook',
      'main.yml',
      '-f',
      '30',
      '-i',
      '/Users/user/Library/Application Support/polkadot-secure-validator/build/w3f/ansible/inventory',
    ]);
  });

  it('preserves args ine key=value format', () => {
    const result = cmd.splitCommandAndArgs('terraform init -var state_project=kusama-infrastructure-state');

    expect(result).toEqual(['terraform', 'init', '-var', 'state_project=kusama-infrastructure-state']);
  });
});
