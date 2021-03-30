module.exports = {
  validatorSshPrivateKeyPath: process.env.SSH_ID_RSA_VALIDATOR,
  publicNodeSshPrivateKeyPath: process.env.SSH_ID_RSA_PUBLIC,
  nginxUsername: process.env.NGINX_USERNAME || "prometheus",
  nginxPassword: process.env.NGINX_PASSWORD || "nginx_password",
};
