import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '3000', 10),
  name: process.env.APP_NAME || 'HAN',
  env: process.env.NODE_ENV || 'development',
}));
