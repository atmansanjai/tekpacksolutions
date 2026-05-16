import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

const config = {
  admin: {
    primaryEmail: process.env['ADMIN_EMAIL'] || 'atmansanjai@gmail.com',
    primaryName: process.env['ADMIN_NAME'] || 'Admin',
  },

  port: parseInt(process.env['PORT'] || '8000', 10),

  nodeEnv: process.env['NODE_ENV'] || 'development',

  mongoUri: process.env['MONGO_URI']!,

  jwt: {
    accessSecret: process.env['JWT_SECRET'] || 'atmansanjai2026',

    refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'refresh_secret_2026',

    accessExpiry: (process.env['JWT_ACCESS_EXPIRY'] || '1d') as StringValue,

    refreshExpiry: (process.env['JWT_REFRESH_EXPIRY'] || '7d') as StringValue,
  },

  google: {
    clientId: process.env['GOOGLE_CLIENT_ID']!,

    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,

    callbackUrl: process.env['GOOGLE_REDIRECT_URI'] || 'http://localhost:8000/auth/google/callback',
  },

  aws: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID']!,

    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']!,

    region: process.env['AWS_REGION'] || 'ap-south-1',

    bucketName: process.env['S3_BUCKET_NAME']!,
  },

  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:3000',
};

export default config;
