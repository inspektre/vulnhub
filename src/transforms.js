import fs from 'fs';
import ApolloClient from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import gql from 'graphql-tag';
import path from 'path';

dotenv.config();
const cweRex = /[0-9]{1,4}$/;
// const cveRex = /^CVE-[0-9]{1,4}-[0-9]{1,6}$/;

const uri = 'http://localhost:4000';

const client = new ApolloClient({
    link: new BatchHttpLink({ uri, fetch, batchInterval: 10, batchMax: 100 }),
    cache: new InMemoryCache()
});


// Read the JSON CVE Feeds into an array
const readData = async (year) => {
    console.log(path.join(process.cwd() ,`feeds/nvdcve-1.1-${year}.json`));
    const file = path.join(process.cwd() ,`feeds/nvdcve-1.1-${year}.json`);
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
        // const cpeRecords = [];
        
        console.log("Reading data for year", year);
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


const generateCveMutations = (records) => {
    // console.log("records total", records.length);
    return records.map((rec) => {
        return {
            mutation: gql`
                mutation CreateCves(
                    $id: String
                    $cwes: [Int]
                    $cpes: [String]
                    $severity: String
                    $impactScore: Float
                    $exploitabilityScore: Float
                    $baseScore: Float
                ) {
                    vuln: CreateCve(
                        id: $id,
                        cwes: $cwes,
                        cpes: $cpes,
                        severity: $severity,
                        impactScore: $impactScore,
                        exploitabilityScore: $exploitabilityScore,
                        baseScore: $baseScore
                    ) {
                        id
                    }
                }
            `,
            variables: rec
        }
    })
};

const getCveSeedMutations = async (year) => {
    const feeds = await transformFeeds(year);
    const seedMutationsPromise = await new Promise((resolve, reject) => {
        try {
            resolve(generateCveMutations(feeds));
        } catch(err) {
            reject(err);
        };
    });
    
    return seedMutationsPromise;
};

const runCveMutations = async (year) => {
    const cveMutations = await getCveSeedMutations(year).catch(err => console.log("seed mutations failed", err));
    if(cveMutations) {
        // console.log("Records:", cveMutations.length);
        return Promise.all(
            cveMutations.map(({mutation, variables}) => {
                // console.log("Creating muttion for:", variables.id);
                return client.mutate({
                    mutation,
                    variables,
                })
                .catch(err => {
                    // console.log("Mutation failed", err);
                    // console.log("err", variables.id);
                    console.log(err);
                    process.exit(1);
                    // console.log(err.networkError);
                    // console.log(variables.id);
                })
            })
        );
    };
};


export { runCveMutations }