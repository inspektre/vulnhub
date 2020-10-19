'use strict';

var _schema = require('./schema');

var _apolloServer = require('apollo-server');

var _neo4jDriver = require('neo4j-driver');

var _neo4jDriver2 = _interopRequireDefault(_neo4jDriver);

var _neo4jGraphqlJs = require('neo4j-graphql-js');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

// Add query and mutations here for override.
var augmentedSchema = (0, _neo4jGraphqlJs.makeAugmentedSchema)({
  typeDefs: _schema.typeDefs
});

var driver = _neo4jDriver2.default.driver(process.env.NEO4J_URI, _neo4jDriver2.default.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), {
  encrypted: process.env.NEO4J_ENCRYPTED ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
});

var server = new _apolloServer.ApolloServer({
  context: function context(_ref) {
    var req = _ref.req;

    return {
      driver: driver,
      neo4jDatabase: process.env.NEO4J_DATABASE,
      req: req
    };
  },
  schema: augmentedSchema,
  introspection: true,
  playground: true
});

server.listen(4000, '0.0.0.0').then(function (_ref2) {
  var url = _ref2.url;

  console.log('GraphQL API is ready at ' + url);
});