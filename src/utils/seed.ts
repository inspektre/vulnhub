import * as fs from'fs';
import * as path from'path';
import { BASE_DIR, CREATE_CVE, createChunk } from'./constants';
import { driver } from './driver'
import cli from 'cli-ux';
const dotenv = require('dotenv');

dotenv.config();
const cweRex = /[0-9]{1,4}$/;
const cveRex = /^CVE-[0-9]{1,4}-[0-9]{1,6}$/;


// Read the JSON CVE Feeds into an array
const readData = async (year: string) => {
    const file = path.join(BASE_DIR ,`nvdcve-1.1-${year}.json`);
    const readCveFilePromise = new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(fs.readFileSync(file).toString())["CVE_Items"]);
        } catch(err) {
            reject(err);
        }
    });
    return readCveFilePromise;
};




// Extract CWE IDs
const extractCwe = (entry: { cve: { problemtype: { problemtype_data: { description: any[]; }[]; }; }; }) => {
    const cwes = new Array();
    entry.cve.problemtype.problemtype_data.forEach((problem: { description: any[]; }) => {
        problem.description.forEach(cwe => {
            const rexMatch = cweRex.exec(cwe.value);
            if(rexMatch) {
                cwes.push(parseInt(rexMatch[0]));
            }
    })});
    return [...new Set(cwes)];
};

// Extract CPEs
const extractCpes = (entry: { configurations: { nodes: any[]; }; }) => {
    const cpes = new Array();
    entry.configurations.nodes.forEach((node: { cpe_match: any; }) => {
        const cpeEntries = node.cpe_match;
        if(cpeEntries && cpeEntries.length > 0) {
            cpeEntries.forEach((cpeEntry: { cpe23Uri: any; }) => cpes.push(cpeEntry.cpe23Uri));
        };
    });
    return [...new Set(cpes)];
};

type CveRecord = {
    id: String,
    year: number,
    cwes: Array<any>,
    cpes: Array<any>,
    severity: String,
    impactScore: number,
    exploitabilityScore: number,
    baseScore: number,

};
//Transform CVEs to Records
const transformFeeds = async (year: string) => {
    const transformsPromise = new Promise((resolve, reject) => {
        const cveRecords: Array<CveRecord> = [];
        readData(year)
        .then((data: any) => {
            // console.log("data", data.length);
            data.forEach((entry: any) => {
                const cveRecord: CveRecord = {
                    id : entry.cve["CVE_data_meta"].ID,
                    year: parseInt(entry.cve["CVE_data_meta"].ID.split('-')[1]),
                    cwes: extractCwe(entry),
                    cpes: extractCpes(entry),
                    severity: '',
                    impactScore: 0.0,
                    exploitabilityScore: 0.0,
                    baseScore: 0.0
                }

                if (entry.impact && Object.keys(entry.impact).length > 0 && entry.impact.baseMetricV2 &&Object.keys(entry.impact.baseMetricV2).length > 0 ) {
                    cveRecord.baseScore = parseFloat(entry.impact.baseMetricV2.cvssV2.baseScore);
                    cveRecord.severity = entry.impact.baseMetricV2.severity;
                    cveRecord.impactScore = parseFloat(entry.impact.baseMetricV2.impactScore);
                    cveRecord.exploitabilityScore = parseFloat(entry.impact.baseMetricV2.exploitabilityScore);
                }
                // Create CVE Record
                cveRecords.push(cveRecord);
            });
            resolve(cveRecords);
        })
        .catch(err => {
            reject(err);
        });
    });
    return transformsPromise;  
};

const recordCveFeed = async (idx: string) => {
    let res;
    try {
        const cveRecords: any = await transformFeeds(idx);
        const chunks = createChunk(cveRecords);
        console.log(`Records: ${cveRecords.length} for feed: ${idx}, Chunks: ${chunks.length}`);
        res = await Promise.all(chunks.map((chunk: any) => driver.session({database: process.env.NEO4J_DATABASE}).run(CREATE_CVE, { cypherList: chunk })));
    } catch(err) {
        console.log('File does not exist.');
    } finally {
        return res;
    }    
};


export const seed = async () => {
    cli.action.start(`Seeding from: ${BASE_DIR}`);
    await recordCveFeed('2002');
    await recordCveFeed('2003');
    await recordCveFeed('2004');
    await recordCveFeed('2005');
    await recordCveFeed('2006');
    await recordCveFeed('2007');
    await recordCveFeed('2008');
    await recordCveFeed('2009');
    await recordCveFeed('2010');
    await recordCveFeed('2011');
    await recordCveFeed('2012');
    await recordCveFeed('2013');
    await recordCveFeed('2014');
    await recordCveFeed('2015');
    await recordCveFeed('2016');
    await recordCveFeed('2017');
    await recordCveFeed('2018');
    await recordCveFeed('2019');
    await recordCveFeed('2020');
    await recordCveFeed('2021');
    await recordCveFeed('modified');
    await recordCveFeed('recent');
    cli.action.stop();
};