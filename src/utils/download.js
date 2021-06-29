/*
Author: Uday Korlimarla
Copyright (c) inspektre.io Pty Ltd
*/
import fs from 'fs';
import zlib from 'zlib';
import fetch from 'node-fetch';
import { homedir } from 'os';


const baseDir = `${homedir()}/.config/inspektre/feeds`;

const cveDownloadUrls = Array.from({length: new Date().getFullYear() - 2001}, (_, i) => {
  const idx = 2001+i+1;
  return { 
    idx,
    uri : `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${idx}.json.gz`
  }
});
cveDownloadUrls.push({ idx: 'modified', uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json.gz' });
cveDownloadUrls.push({ idx: 'recent', uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-recent.json.gz' });

const writeNvDFeedJson = async (idx, file) => {
  const contents = fs.createReadStream(file);
  const writeStream = fs.createWriteStream(`${baseDir}/nvdcve-1.1-${idx}.json`);
  const unzip = zlib.createGunzip();
  contents.pipe(unzip).pipe(writeStream);
};

const feedDownload = async (entry, type) => {
  
  console.log("Fetching entry", entry.uri)
  const res = await fetch(entry.uri).catch(err => {
    console.log(`Failed to get entry for feed: ${entry.idx}, URI at: ${entry.uri}`);
  });
  const cfile = (type === 'cve')? `${baseDir}/nvdcve-1.1-${entry.idx}.gz` : '';
  const fileStream = fs.createWriteStream(cfile);
  if (!res.body) {
    console.dir(res || !res.ok);
    process.exit(-1);
  }
  res.body.pipe(fileStream);
  res.body.on("error", (err) => {
      fileStream.close();
  });
  fileStream.on("finish", async () => {
      fileStream.close();
      console.log("Extracting", cfile);
      await writeNvDFeedJson(entry.idx, cfile);
  });
};

const download = async () => {
  if(!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
  }
  console.log("Base Directory:", baseDir);
  let type='cve';
  await cveDownloadUrls.forEach(async (entry) => {
    await feedDownload(entry, type);
    return true
  });
};

download().then(() => {}).catch(err => console.error(err));