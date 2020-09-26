/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import { getJsonCveFeeds } from './cveFeeds';

// Manage CVE Feeds
class VulnHub {
    constructor() {
        this.getfeeds = getJsonCveFeeds;
    }
}

const vulnhub = new VulnHub();
vulnhub.getfeeds();