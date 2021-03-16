const chalk = require('chalk');
const fs = require('fs-extra');

const { validatorSshPrivateKeyPath, publicNodeSshPrivateKeyPath } = require('./env');


module.exports = {
  keys: () => {
    if(!validatorSshPrivateKeyPath) {
      console.log(chalk.red('Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_ED25519_VALIDATOR'));
      process.exit(-1);
    }
    if(!publicNodeSshPrivateKeyPath) {
      console.log(chalk.red('Please, export the path of the file with the private SSH key you want to use on public nodes as the environment variable SSH_ID_ED25519_PUBLIC'));
      process.exit(-1);
    }

    const validatorPublicKey = publicKeyFromPrivateKeyPath(validatorSshPrivateKeyPath);
    const publicNodePublicKey = publicKeyFromPrivateKeyPath(publicNodeSshPrivateKeyPath);

    return {validatorPublicKey, publicNodePublicKey};
  }
}

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  return fs.readFileSync(`${privateKeyPath}.pub`, 'utf8').trim()
}