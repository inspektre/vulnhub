/*
Author: Uday Korlimarla
Copyright (c) inspektre.io Pty Ltd
*/
import fs from 'fs';
import { BASE_DIR, CVE_FEEDS } from './constants';
import fetch from 'node-fetch';
import gunzip from 'gunzip-file';


const cveFeedDownload = (entry) => {
  fetch(entry.uri)
  .then((res) => {
    const fileStream = fs.createWriteStream(entry.compressed);
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
        fileStream.close();
    });
    fileStream.on("error", () => {
      console.log("Error in saving download for: ", entry.idx);
    })
    fileStream.on("finish", () => {
        fileStream.close();
        gunzip(entry.compressed, entry.json,  (err, res) => {
          if(!err) {
            console.log(`nvdcve-1.1-${entry.idx} extracted`);
          }
        });
        fs.unlinkSync(entry.compressed);
    });
  })
  .catch(err => {
    console.log(`Failed to get entry for feed: ${entry.idx}`);
    console.log(err);
  });
};


const download = () => {
  CVE_FEEDS.forEach((entry) => {
    if(!fs.existsSync(BASE_DIR)){
      fs.mkdirSync(BASE_DIR);
    }
    cveFeedDownload(entry);
  });
}

download();