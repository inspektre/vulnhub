import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { BASE_DIR, CVE_FEEDS, CREATE_CVE } from './constants';
import driver from './driver';

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

const createCves = async () => {
    const session = await driver.session({database: process.env.NEO4J_DATABASE});
    const cypherList = asvs.map((rec) => {
      const { chapterId, chapterName, sectionId, sectionName, requirementId, description, level1, level2, level3 } = rec;
      const nistId = rec.nistId? rec.nistId: '';
      const cweId = rec.cweId? rec.cweId: '';
      return {
        chapterId, chapterName, sectionId, sectionName, requirementId, description, level1, level2, level3, nistId, cweId
      }
    });
    await session.run(
      CREATE_ASVS,
      { cypherList }
    ).catch(err => console.dir(err));
};

CVE_FEEDS.forEach(async (entry) => {
    if(!fs.existsSync(BASE_DIR)){
      console.log('Please run `yarn init` or npm run init. Could not fund downlods')
    }
    const data = await transformFeeds(entry.idx).catch(err => console.log('err', err));
    if(!data) {
        console.log(`could not read feed nvdcve-1.1-${entry}.json.idx`);
    } else {
        console.log(data.length);
    }
});