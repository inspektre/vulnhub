import neo4j from"neo4j-driver";
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.NEO4J_URI ? process.env.NEO4J_URI : 'bolt+ssc://localhost:7687';



if(!(uri.startsWith('neo4j+s') || uri.startsWith('bolt+s'))) {
  console.warn('Please ensure TLS Encryption.');
  process.exit(-1);
};

export const driver: typeof neo4j.Driver = neo4j.driver(uri, neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!));
