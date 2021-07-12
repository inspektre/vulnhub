import { ApolloServer }from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import{ Neo4jGraphQL } from "@neo4j/graphql";
const dotenv = require('dotenv');
import { driver } from './driver';
const typeDefs = require("./schema");
import { resolvers } from '../utils/resolvers';

dotenv.config();

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

export const port = process.env.PORT || 4000;