import mongoose from 'mongoose';
import logger from './Logger.js';

const ConnectDatabase = async (uri: string) => {
  if (!uri) {
    console.error('Database URI is missing!');
    return;
  }
  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
  };

  await mongoose.connect(uri, options);

  mongoose.connection.on('error', (err) => logger.error(err));

  mongoose.set('debug', true);
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => logger.info('Connected to MongoDB'));
  mongoose.connection.on('open', () => logger.trace('open'));
  mongoose.connection.on('disconnected', () => logger.warn('disconnected'));
  mongoose.connection.on('reconnected', () => logger.trace('reconnected'));
  mongoose.connection.on('disconnecting', () => logger.warn('disconnecting'));
  mongoose.connection.on('close', () => logger.trace('close'));
};

export default ConnectDatabase;
