module.exports = {
  validatorSshPrivateKeyPath: process.env.SSH_ID_RSA_VALIDATOR,
  publicNodeSshPrivateKeyPath: process.env.SSH_ID_RSA_PUBLIC,
  nginxUsername: process.env.NGINX_USERNAME || "nginx_user",
  nginxPassword: process.env.NGINX_PASSWORD || "nginx_password",
};
