'use strict';

var _downloadFeeds = require('./downloadFeeds');

var _transforms = require('./transforms');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
                                                                                                                                                          Author: Uday Korlimarla
                                                                                                                                                          Copyright (c) Inspektre Pty Ltd
                                                                                                                                                          */


// Manage CVE Feeds
var VulnHub = function VulnHub() {
    _classCallCheck(this, VulnHub);

    this.getfeeds = _downloadFeeds.getJsonCveFeeds;
    this.cveTransforms = _transforms.runCveMutations;
};

var vulnhub = new VulnHub();

// Download CVE Feeds
// vulnhub.getfeeds();

// CVE Mutations
console.log("Initializgin CVE Seed Mutations");

var runCVESeed = function runCVESeed() {
    (0, _transforms.runCveMutations)(2002).then(function () {
        return console.log("Completed for the year", 200);
    }).catch(function (err) {
        return console.log(err.message);
    });
    // const maxYear = new Date().getFullYear();
    // for (let i=2002; i<= maxYear; i++) {
    //     runCveMutations(i);
    // }
};

runCVESeed();