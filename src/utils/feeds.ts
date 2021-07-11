import cli from 'cli-ux';
import * as fs from'fs';
import { BASE_DIR, DOWNLOAD_FEEDS } from './constants';
const fetch = require('node-fetch');

type Entry = {
  idx: string,
  uri: string,
  compressed: string,
  json: string,
};


const cveFeedDownload = async (entry: Entry) => {
  return new Promise((resolve, reject) => {
    const options = {
      times: 5,
      initialDelay: 100,
      retryDelay: 100
    };
    fetch(entry.uri, options)
    .then((res: any) => {
      const fileStream = fs.createWriteStream(entry.compressed);
      res.body.pipe(fileStream);
      res.body.on("error", (err: any) => {
          fileStream.close();
      });
      fileStream.on("error", () => {
        console.log("Error in saving download for: ", entry.idx);
      })
      fileStream.on("finish", () => {
        fileStream.close();
        resolve({});
      });
    })
    .catch((err: any) => {
      reject(err);
    });
  })
};


export const getFeeds = async () => {
  if(!fs.existsSync(BASE_DIR)){
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
  cli.action.start(`Downloading Feeds to: ${BASE_DIR}`);
  await Promise.all(DOWNLOAD_FEEDS.map(entry => cveFeedDownload(entry)));
  cli.action.stop();
};