/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import { getJsonCveFeeds } from './feeds';
import { transformFeeds } from './transforms';

// Manage CVE Feeds
class VulnHub {
    constructor() {
        this.getfeeds = getJsonCveFeeds;
        this.transforms = transformFeeds;
    }
}

const vulnhub = new VulnHub();

// Download CVE Feeds
// vulnhub.getfeeds();
vulnhub.transforms()
.then(data => {
    console.log(Object.keys(data));
    data.cpes.forEach(cpe => console.log(cpe));
    // cves.forEach(cve => console.dir(cve));
})
.catch(err => console.log(err));



