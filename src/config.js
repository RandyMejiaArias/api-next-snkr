import { config } from 'dotenv';
config();

export default {
  PORT: process.env.PORT || 4000,
  API_GATEWAY_URL: process.env.API_GATEWAY_URL,
  SECRET: process.env.SECRET_KEY,
  DB_ADMIN_USER: process.env.DB_ADMIN_USER,
  DB_ADMIN_EMAIL: process.env.DB_ADMIN_EMAIL,
  DB_ADMIN_PASS: process.env.DB_ADMIN_PASS,
  MONGODB_URI: process.env.MONGODB_URI,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  TOKEN_TIMEOUT: process.env.TOKEN_TIMEOUT
};
