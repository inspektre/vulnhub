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

// const maxYear = new Date().getFullYear();
runCveMutations()
.then(() => console.log("completed"))
.catch(err => console.log("erred", err));


