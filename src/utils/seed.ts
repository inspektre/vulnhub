import fs from'fs';
import path from'path';
import dotenv from'dotenv';
import { BASE_DIR, UPDATE_CVE_FEEDS_RECENT, UPDATE_CVE_FEEDS_MODIFIED, CREATE_CVE, createChunk } from'./constants';
import driver from'./driver';

dotenv.config();
const cweRex = /[0-9]{1,4}$/;
const cveRex = /^CVE-[0-9]{1,4}-[0-9]{1,6}$/;


// Read the JSON CVE Feeds into an array
const readData = async (year) => {
    const file = path.join(BASE_DIR ,`nvdcve-1.1-${year}.json`);
    const readCveFilePromise = new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(fs.readFileSync(file))["CVE_Items"]);
        } catch(err) {
            reject(err);
        }
    });
    return readCveFilePromise;
};

// Extract CWE IDs
const extractCwe = (entry) => {
    const cwes = [];
    entry.cve.problemtype.problemtype_data.forEach(problem => {
        problem.description.forEach(cwe => {
            const rexMatch = cweRex.exec(cwe.value);
            if(rexMatch) {
                cwes.push(parseInt(rexMatch[0]));
            }
    })});
    return [...new Set(cwes)];
};

// Extract CPEs
const extractCpes = (entry) => {
    const cpes = [];
    entry.configurations.nodes.forEach(node => {
        const cpeEntries = node.cpe_match;
        if(cpeEntries && cpeEntries.length > 0) {
            cpeEntries.forEach(cpeEntry => cpes.push(cpeEntry.cpe23Uri));
        };
    });
    return [...new Set(cpes)];
};

//Transform CVEs to Records
const transformFeeds = async (year) => {
    const transformsPromise = new Promise((resolve, reject) => {
        const cveRecords = [];
        readData(year)
        .then(data => {
            // console.log("data", data.length);
            data.forEach(entry => {
                let cveRecord = {};
                
                // CVE-2011-1234
                // console.log("Entry", entry.cve["CVE_data_meta"].ID);
                cveRecord.id = entry.cve["CVE_data_meta"].ID
                cveRecord.year = entry.cve["CVE_data_meta"].ID.split('-')[1];
                cveRecord.cwes = extractCwe(entry);
                // CPE Configurations
                cveRecord.cpes = extractCpes(entry);
                
                // CVE Impact
                // console.log(entry.impact);
                // CVE Impact cvss V2
                cveRecord.severity = '';
                cveRecord.impactScore = 0;
                cveRecord.exploitabilityScore = 0;

                cveRecord.baseScore = 0.0;
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

const histCVEs = async (year) => {
    let res;
    try {
        const cveRecords = await transformFeeds(year);
        const chunks = createChunk(cveRecords);
        console.log(`Records: ${cveRecords.length} for year: ${year}, Chunks: ${chunks.length}`);
        res = await Promise.all(chunks.map(chunk => driver.session({database: process.env.NEO4J_DATABASE}).run(CREATE_CVE, { cypherList: chunk })));
    } catch(err) {
        console.log(err);
    } finally {
        console.log('Completed CVE entries for :', year)
        return res;
    }    
};


const update = async () => {
    let resModified;
    let resRecent;
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
        console.log("finishing updates");
        return { m: resModified.summary.resultAvailableAfter, r: resRecent.summary.resultAvailableAfter }
    }
};


const seed = async () => {
    // To-Do: Future-proof for 2022 and on-wards.
    // Avoid this for Neo connection acqusition timeouts;
    // await Promise.all(CVE_FEEDS.map(feed => histCVEs(feed.idx)));
    await histCVEs(2002);
    await histCVEs(2003);
    await histCVEs(2004);
    await histCVEs(2005);
    await histCVEs(2006);
    await histCVEs(2007);
    await histCVEs(2008);
    await histCVEs(2009);
    await histCVEs(2010);
    await histCVEs(2011);
    await histCVEs(2012);
    await histCVEs(2013);
    await histCVEs(2014);
    await histCVEs(2015);
    await histCVEs(2016);
    await histCVEs(2017);
    await histCVEs(2018);
    await histCVEs(2019);
    await histCVEs(2020);
    await histCVEs(2021);
    await update();
}


module.exports = {
    transformFeeds,
    seed,
    update
}