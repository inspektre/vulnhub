import * as fs from'fs';
const fetch = require('node-fetch');
import { BASE_DIR, DOWNLOAD_FEEDS } from './constants';

// No types present
const gunzip = require('gunzip-file');


const cveFeedDownload = (entry: any) => {
  fetch(entry.uri)
  .then((res: any) => {
    console.log(`Feed: ${entry.idx}, Location: ${entry.compressed}`);
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
        gunzip(entry.compressed, entry.json,  (err: any, res: any) => {
          if(err) {
            console.error('error in compressed file', entry.compressed)
          }
          else {
            console.log(`nvdcve-1.1-${entry.idx} extracted`);
          }
        });
        fs.unlinkSync(entry.compressed);
    });
  })
  .catch((err: any) => {
    console.log(`Failed to get entry for feed: ${entry.idx}. Try downloading again`);
  });
};


export const getFeeds = () => {
  DOWNLOAD_FEEDS.forEach((entry: any) => {
    if(!fs.existsSync(BASE_DIR)){
      fs.mkdirSync(BASE_DIR);
    }
    cveFeedDownload(entry);
  });
};