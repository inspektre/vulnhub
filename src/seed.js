/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import { getJsonCveFeeds } from './downloadFeeds';
import { runCveMutations } from './transforms';



// Download CVE Feeds
// getJsonCveFeeds();

// CVE Mutations
console.log("Initializgin CVE Seed Mutations");

const maxYear = new Date().getFullYear();
for (let currentYear = 2002; currentYear >= maxYear; currentYear++) {
    runCveMutations(year)
    .then(() => console.log("completed", year))
    .catch(err => console.log("erred", err));
}