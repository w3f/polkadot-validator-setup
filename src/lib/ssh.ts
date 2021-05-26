import fs from 'fs-extra';
import forge from 'node-forge';
import { publicNodeSshPrivateKeyPath, validatorSshPrivateKeyPath } from './env';
import logger from './logger';

const ssh = {
  keys: () => {
    if (!validatorSshPrivateKeyPath) {
      logger.error(
        'Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_RSA_VALIDATOR',
      );
      process.exit(-1);
    }
    if (!publicNodeSshPrivateKeyPath) {
      logger.error(
        'Please, export the path of the file with the private SSH key you want to use on public nodes as the environment variable SSH_ID_RSA_PUBLIC',
      );
      process.exit(-1);
    }

    const validatorPublicKey = publicKeyFromPrivateKeyPath(validatorSshPrivateKeyPath);
    const publicNodePublicKey = publicKeyFromPrivateKeyPath(publicNodeSshPrivateKeyPath);

    return { validatorPublicKey, publicNodePublicKey };
  },
};

function publicKeyFromPrivateKeyPath(privateKeyPath: string) {
  const privateKey = fs.readFileSync(privateKeyPath);

  const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey.toString());
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

  return forge.ssh.publicKeyToOpenSSH(forgePublicKey).trim();
}

export default ssh;
