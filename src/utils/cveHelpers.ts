import cli from 'cli-ux';
import { CREATE_CVE_INDICES, CREATE_CWE_RELATION, BASE_DIR, IDXS  } from'./constants';
import { driver } from './driver';
const dotenv = require('dotenv');
import * as fs from'fs';
import * as zlib from 'zlib';

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
};

const extractFeed = async (feed: string) => {
  return new Promise((resolve, reject) => {
    const cFile = `${BASE_DIR}/nvdcve-1.1-${feed}.json.gz`;
    const jFile = `${BASE_DIR}/nvdcve-1.1-${feed}.json`;
    fs.readFile(cFile, function(err, cdata) {
      if(!err && cdata) {
        zlib.gunzip(cdata, function(err, data){
          if(!err && data) {
            fs.writeFileSync(jFile, data.toString());
            resolve({});
          }
          if(err) {
            reject(err);
          }
        })
      }
    });
  });
}


export const extractFeeds = async () => {
  cli.action.start(`Extracting Feeds from: ${BASE_DIR}`);
  await Promise.all(IDXS.map(idx => extractFeed(idx)));
  cli.action.stop();
};