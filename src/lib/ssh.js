const fs = require('fs-extra');
const forge = require('node-forge');


module.exports = {
  publicKeyFromPrivateKeyPath: (privateKeyPath) => {
    const privateKey = fs.readFileSync(privateKeyPath);

    const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
    const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);
    const publicKey = forge.pki.publicKeyToPem(forgePublicKey);

    return forge.ssh.publicKeyToOpenSSH(forgePublicKey);
  }
}
