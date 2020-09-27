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
.then(data => console.log(data.cpes.length))
.catch(err => console.log(err));



