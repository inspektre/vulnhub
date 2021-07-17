import cli from 'cli-ux';
import { CREATE_CVE_INDICES, CREATE_CWE_RELATION, BASE_DIR, IDXS  } from'./constants';
import { driver } from './driver';
import * as fs from'fs';

const yauzl = require('yauzl');
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
};

const extractFeed = async (feed: string) => {
  return await new Promise((resolve, reject) => {
    const src = `${BASE_DIR}/nvdcve-1.1-${feed}.json.zip`;
    const dest =`${BASE_DIR}/nvdcve-1.1-${feed}.json`;

    yauzl.open(src, {lazyEntries: true}, (err: any, zipfile: { readEntry: () => void; on: (arg0: string, arg1: (entry: any) => void) => void; openReadStream: (arg0: any, arg1: (err: any, readStream: any) => void) => void; }) => {  
      // if (err) reject(err);
      try {
        zipfile.readEntry()
        zipfile?.on("entry", function(entry: any) {
          // console.log(entry.fileName);
          if (entry.fileName === `nvdcve-1.1-${feed}.json`) {
            zipfile.openReadStream(entry, function(err: any, readStream: any) {
              readStream.pipe(fs.createWriteStream(dest));
              resolve({})
            });
          }
          resolve({} as any);
        });
        
      } catch (err) {
        // reject({message: 'Error in decompressing'} as any);
      }
    });

  });
};



export const extractFeeds = async () => {
  cli.action.start(`Extracting Feeds from: ${BASE_DIR}`);
  await Promise.all(IDXS.map(idx => extractFeed(idx)));
  cli.action.stop();
};