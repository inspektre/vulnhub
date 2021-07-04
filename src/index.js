#!/usr/bin/env node
// Copyrigght (c) Uday Korlimarla

const dotenv = require("dotenv");
const commander = require('commander');
const packageJson = require('../package.json');
const { seed, update } = require('./utils/seed');
const download = require('./utils/download');
dotenv.config();

const program = new commander.Command();
program.storeOptionsAsProperties(true).passCommandToAction(true);
// Set Version from package.json
program.version(packageJson.version);
program.description('inspektre vulnhub'.concat(` v${packageJson.version}`));

program
.command('version', "Display the version of Inspektre-CLI in use.")
.action((action) => {
  const version = action.version || false;
  if(version) {
    process.stdout.write('inspektre v'.concat(packageJson.version, '\n'));
  }
});

// Seeding
program
.command('seed')
.description('Seed Neo4j Database with CVEs')
.action(() => {
  seed().then(() => { process.exit(0)}).catch(err => console.error(err));
});


// Update CVEs
program
.command('update')
.description('Update Neo4j Database with CVEs Recent and Modified')
.action(() => {
  update().then(() => { process.exit(0)}).catch(err => console.error(err));
});

program
.command('download')
.description('Download & Extract gzip JSON feeds from NVD')
.action(() => {
  update().then(() => { process.exit(0)}).catch(err => console.error(err));
});
