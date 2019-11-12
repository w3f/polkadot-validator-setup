const dotenv = require('dotenv');


dotenv.config();

module.exports = {
  validatorSshPrivateKeyPath: process.env.SSH_ID_RSA_VALIDATOR,
  publicNodeSshPrivateKeyPath: process.env.SSH_ID_RSA_PUBLIC,
  nodeExporterUsername: process.env.NODE_EXPORTER_USERNAME,
  nodeExporterPassword: process.env.NODE_EXPORTER_PASSWORD,
};
