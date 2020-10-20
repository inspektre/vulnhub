import { typeDefs } from './schema';
import { ApolloServer } from 'apollo-server';
import neo4j from 'neo4j-driver';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import dotenv from "dotenv";

dotenv.config();


// Add query and mutations here for override.
const augmentedSchema = makeAugmentedSchema({
  typeDefs
});

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD,
  )
);

const server = new ApolloServer({
  context: ({ req }) => {
    return {
      driver,
      neo4jDatabase: process.env.NEO4J_DATABASE,
      req
    }
  },
  schema: augmentedSchema,
  introspection: true,
  playground: true,
})


server.listen(4000, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API is ready at ${url}`);
})