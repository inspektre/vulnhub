import { ApolloServer }from "apollo-server-express";
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import{ Neo4jGraphQL } from "@neo4j/graphql";
import { driver } from './driver';
import { typeDefs } from "./schema";
import { resolvers } from '../utils/resolvers';
import * as express from 'express';

const dotenv = require('dotenv');
dotenv.config();

export const app: any = express();

// For Authenticated clients, Checked authN & authZ with config section
// config: {
//   jwt: {
//     secret: process.env.JWT_SECRET
//   }
// }
const neo4jGraphQL = new Neo4jGraphQL({ 
  typeDefs,
  resolvers,
  driver,
});

export const server = new ApolloServer({ 
  schema: neo4jGraphQL.schema,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "@inspektre/vulnhub",
          footer: true,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: true }),
  ],
  context: ({ req }) => {
    return {
      driver,
      driverConfig: { database: process.env.NEO4J_DATABASE },
      headers: req.headers,
      req
    }
  },
});


module.exports = {
  app,
  server
}