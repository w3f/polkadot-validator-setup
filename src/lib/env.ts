import { config } from 'dotenv';
config();

export const validatorSshPrivateKeyPath = process.env.SSH_ID_RSA_VALIDATOR;
export const publicNodeSshPrivateKeyPath = process.env.SSH_ID_RSA_PUBLIC;
export const nginxUsername = process.env.NGINX_USERNAME || 'prometheus';
export const nginxPassword = process.env.NGINX_PASSWORD || 'nginx_password';
