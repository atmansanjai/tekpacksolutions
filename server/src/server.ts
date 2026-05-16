import ConnectDatabase from './database.js';
import Config from './Config.js';
import logger from './Logger.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer } from './graphql/directive/authDirectiveTransformer.js';
import { ApolloServer } from '@apollo/server';
import { createContext } from './graphql/context/Context.js';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolver/index.js';
import { AdminInitializer } from './utils/AdminInitializer.js';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import * as http from 'node:http';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import app from './app.js';

async function startServer() {
  await ConnectDatabase(Config.mongoUri).then(() => logger.info('Connected to MongoDB'));
  await AdminInitializer().then(() => logger.info('Admin created successfully'));

  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  schema = authDirectiveTransformer(schema);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    introspection: true,
    formatError: (formattedError, error) => {
      console.error(error);
      return formattedError;
    },
  });

  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => await createContext(req, res),
    }),
  );

  const httpServer = http.createServer(app);

  httpServer.listen(Config.port, () => {
    logger.info(`Server running on ${Config.port}`);
  });
}

// Global Error Handling
process.on('uncaughtException', (err) => logger.fatal({ err }, 'UNCAUGHT EXCEPTION'));
process.on('unhandledRejection', (reason) => logger.error({ err: reason }, 'UNHANDLED REJECTION'));

startServer().catch((err) => {
  logger.error(err);
  process.exit(1);
});
