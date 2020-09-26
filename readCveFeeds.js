import { rejects } from 'assert';
/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import fs from 'fs';


const getCveFeedFiles = async () => {
    const feedFilesPromise = new Promise((resolve, reject) => {
        let feeds = [];
        try {
            const entries = [];
            const maxYear = new Date().getFullYear();
            for (let i = 2002; i <= maxYear; i++) {
                entries.push(i);
            }
            entries.push('modified');
            entries.push('recent');
            feeds = entries.map(entry => {
                return {name: `${entry}`, file:`feeds/nvdcve-1.1-${entry}.json`};
            });
            resolve(feeds);
        } catch(err) {
            reject(err);
        }
    })
    return feedFilesPromise;
};

// Read the JSON CVE Feeds into an array
const readData = async () => {
    let feeds = [];
    await getCveFeedFiles().then(data => feeds=data).catch(err => console.log(err));
    const readFeedsPromise = new Promise((resolve, reject) => {
        const cveJsonData = [];
        try {
            feeds.forEach(feed => {
                cveJsonData.push({
                    name: feed.name,
                    data: JSON.parse(fs.readFileSync(feed.file))["CVE_Items"]
                });
           });
           resolve(cveJsonData);
        } catch(err) {
            reject(err);
        }
    });
    return readFeedsPromise;
};

const transformFeeds = () => {
    const records = [];
    readData()
    .then(feeds => {
        feeds.forEach(feed => {
            feed.data.forEach(entry => {
                let record = {};
                record.id = entry.cve["CVE_data_meta"].ID;
                record.assigner = entry.cve
                records.push(record);
            })
        })
    })
    .catch(err => console.log(err));
}
