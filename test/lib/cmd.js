const {splitCommandAndArgs} = require('../../src/lib/cmd');

require('chai').should()

describe('Command splitting', () => {

  it('preserves args with spaces in but in quotes', () => {
    splitCommandAndArgs(`ansible-playbook main.yml -f 30 -i "/Users/user/Library/Application Support/polkadot-secure-validator/build/w3f/ansible/inventory"`)
      .should.deep.eq(
      [
        'ansible-playbook',
        'main.yml',
        '-f',
        '30',
        '-i',
        '/Users/user/Library/Application Support/polkadot-secure-validator/build/w3f/ansible/inventory'
      ]
    );

  });

  it('preserves args ine key=value format', () => {
    splitCommandAndArgs(`terraform init -var state_project=kusama-infrastructure-state`)
      .should.deep.eq(['terraform', 'init', '-var', 'state_project=kusama-infrastructure-state'])
  });
});
