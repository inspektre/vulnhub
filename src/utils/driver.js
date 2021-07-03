const neo4j = require("neo4j-driver");
const dotenv = require('dotenv');

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI, 
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

module.exports = driver;