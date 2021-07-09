import cli from 'cli-ux';
import { CREATE_CVE_INDICES, CREATE_CWE_RELATION  } from'./constants';
import { driver } from './driver';
const dotenv = require('dotenv');

dotenv.config();

// Neo4J indices on CVE nodes
export const createIndices = async () => {
  cli.action.start('Index creation');
  await Promise.all(CREATE_CVE_INDICES.map(idx => driver.session({database: process.env.NEO4J_DATABASE}).run(idx)));
  cli.action.stop();
};

export const createGraphs = async () => {
  console.log('Graph creation is disabled');
  // cli.action.start('Graph creation');
  // // await Promise.all(CREATE_CWE_RELATION.map(idx => driver.session({database: process.env.NEO4J_DATABASE}).run(idx)));
  // for await (const idx of CREATE_CWE_RELATION) {
  //   await driver.session({database: process.env.NEO4J_DATABASE}).run(idx);
  // }
  // cli.action.stop();
} 