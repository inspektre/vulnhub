import * as fs from'fs';
import { Integer } from 'neo4j-driver';
import * as path from'path';
import { BASE_DIR, CVE_FEEDS, UPDATE_CVE_FEEDS_RECENT, UPDATE_CVE_FEEDS_MODIFIED, CREATE_CVE, createChunk } from'./constants';
import { driver } from './driver'
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
    year: Integer,
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
                    year: entry.cve["CVE_data_meta"].ID.split('-')[1],
                    cwes: extractCwe(entry),
                    cpes: extractCpes(entry),
                    severity: '',
                    impactScore: 0.0,
                    exploitabilityScore: 0.0,
                    baseScore: 0.0
                }

                if (entry.impact && Object.keys(entry.impact).length > 0 && entry.impact.baseMetricV2 &&Object.keys(entry.impact.baseMetricV2).length > 0 ) {
                    cveRecord.baseScore = entry.impact.baseMetricV2.cvssV2.baseScore;
                    cveRecord.severity = entry.impact.baseMetricV2.severity;
                    cveRecord.impactScore = entry.impact.baseMetricV2.impactScore;
                    cveRecord.exploitabilityScore = entry.impact.baseMetricV2.exploitabilityScore;
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

const histCVEs = async (year: string) => {
    let res;
    try {
        const cveRecords: any = await transformFeeds(year);
        const chunks = createChunk(cveRecords);
        console.log(`Records: ${cveRecords.length} for year: ${year}, Chunks: ${chunks.length}`);
        res = await Promise.all(chunks.map((chunk: any) => driver.session({database: process.env.NEO4J_DATABASE}).run(CREATE_CVE, { cypherList: chunk })));
    } catch(err) {
        console.log(err);
    } finally {
        return res;
    }    
};


export const update = async () => {
    let resModified: any;
    let resRecent: any;
    try {
        const sessionM = await driver.session({database: process.env.NEO4J_DATABASE});
        const cveRecordsM = await transformFeeds(UPDATE_CVE_FEEDS_MODIFIED.idx);
        resModified = await sessionM.run(CREATE_CVE, { cypherList: cveRecordsM });
        await sessionM.close();

        const sessionR = await driver.session({database: process.env.NEO4J_DATABASE});
        const cveRecordsR = await transformFeeds(UPDATE_CVE_FEEDS_RECENT.idx);
        resRecent = await sessionR.run(CREATE_CVE, { cypherList: cveRecordsR });
        await sessionR.close();
    } catch(err) {
        console.log(err);
    } finally {
        return { m: resModified.summary.resultAvailableAfter, r: resRecent.summary.resultAvailableAfter }
    }
};


export const seed = async () => {
    // To-Do: Future-proof for 2022 and on-wards.
    // Avoid this for Neo connection acqusition timeouts;
    // await Promise.all(CVE_FEEDS.map(feed => histCVEs(feed.idx)));
    await histCVEs('2002');
    await histCVEs('2003');
    await histCVEs('2004');
    await histCVEs('2005');
    await histCVEs('2006');
    await histCVEs('2007');
    await histCVEs('2008');
    await histCVEs('2009');
    await histCVEs('2010');
    await histCVEs('2011');
    await histCVEs('2012');
    await histCVEs('2013');
    await histCVEs('2014');
    await histCVEs('2015');
    await histCVEs('2016');
    await histCVEs('2017');
    await histCVEs('2018');
    await histCVEs('2019');
    await histCVEs('2020');
    await histCVEs('2021');
    await update();
};