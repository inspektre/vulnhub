/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import fs from 'fs';
import zlib from 'zlib';
import fetch from 'node-fetch';


// Generate uris for NVD JSON Feed
const generateUris = () => {
    const entries = [];
    const maxYear = new Date().getFullYear();
    for (let i = 2002; i <= maxYear; i++) {
        entries.push(i);
    }
    entries.concat(['modified', 'recent']);
    return entries.map(entry => {
        return {name: `${entry}`, uri:`https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${entry}.json.gz`};
    });
}



// Read gz compressed files and extract the json files
const writeNvDFeedJson = async (name, file) => {
    const contents = fs.createReadStream(file);
    const writeStream = fs.createWriteStream(`./feeds/nvdcve-1.1-${name}.json`);
    const unzip = zlib.createGunzip();
    contents.pipe(unzip).pipe(writeStream);
};


// Download a single feed from entry param
const feedDownload = async (entry) => {
    const res = await fetch(entry.uri).catch(err => {
        console.log(`Failed to get entry for feed: ${entry.name}, URI at: ${entry.uri}`)
    })
    
    await new Promise((resolve, reject) => {
        let cfile = `feeds/nvdcve-1.1-${entry.name}.gz`;
        const fileStream = fs.createWriteStream(cfile);
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            fileStream.close();
            reject(err);
        });
        fileStream.on("finish", function() {
            fileStream.close();
            console.log("extracting", cfile);
            writeNvDFeedJson(entry.name, cfile);
            resolve();
        });
    });
};


// Download All NVD Feeds and save JSON
const getJsonCveFeeds = async () => {
    if(!fs.existsSync('feeds')){
        fs.mkdirSync('feeds');
    }
    await generateUris().forEach(entry => feedDownload(entry));
};


export { getJsonCveFeeds };