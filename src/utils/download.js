/*  Copyright (c) iUday Korlimarla */

const fs = require('fs');
const { BASE_DIR, DOWNLOAD_FEEDS } = require('./constants');
const fetch = require('node-fetch');
const gunzip = require('gunzip-file');


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
          } else {
            console.error(err);
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
  DOWNLOAD_FEEDS.forEach((entry) => {
    if(!fs.existsSync(BASE_DIR)){
      fs.mkdirSync(BASE_DIR);
    }
    cveFeedDownload(entry);
  });
}

module.exports = {
  download
};