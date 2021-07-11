import cli from 'cli-ux';
import * as fs from'fs';
import { BASE_DIR, DOWNLOAD_FEEDS, IDXS } from './constants';
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
      times: 10,
      initialDelay: 100,
      retryDelay: 10000
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

const checkDownloads =  () => {
  const redownload: Entry[] = new Array();
  DOWNLOAD_FEEDS.forEach(entry => {
    if(!fs.existsSync(entry.compressed)) {
      redownload.push(entry);
    }
  });
  return redownload
}


export const getFeeds = async () => {
  let redownload: Entry[] = new Array();
  if(!fs.existsSync(BASE_DIR)){
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
  cli.action.start(`Downloading Feeds to: ${BASE_DIR}`);
  await Promise.all(DOWNLOAD_FEEDS.map(entry => cveFeedDownload(entry)));
  redownload = checkDownloads();
  do {
    await Promise.all(redownload.map(entry => cveFeedDownload(entry)));
    redownload = checkDownloads(); 
  }
  while(redownload.length !== 0);
  cli.action.stop();
};