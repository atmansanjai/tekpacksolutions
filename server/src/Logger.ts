import type { LoggerOptions } from 'pino';
import pino from 'pino';
import Config from './Config.js';

const pinoOptions: LoggerOptions = {
  level: Config.nodeEnv === 'production' ? 'info' : 'debug',
};
const logger = pino(pinoOptions);

export default logger;
