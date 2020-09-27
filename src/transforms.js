import { rejects } from 'assert';
/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import fs from 'fs';
import gql from 'graphql-tag';
import dotenv from 'dotenv';

dotenv.config();
const cweRex = /[0-9]{1,4}$/;
const cveRex = /CVE-[]{1,4}-[]{1,6}/;

const getCveFeedFiles = async () => {
    const feedFilesPromise = new Promise((resolve, reject) => {
        let feeds = [];
        try {
            const entries = [];
            const maxYear = new Date().getFullYear();
            for (let i = 2002; i <= maxYear; i++) {
                entries.push(i);
            }
            entries.push('modified');
            entries.push('recent');
            feeds = entries.map(entry => {
                return {name: `${entry}`, file:`feeds/nvdcve-1.1-${entry}.json`};
            });
            resolve(feeds);
        } catch(err) {
            reject(err);
        }
    })
    return feedFilesPromise;
};

// Read the JSON CVE Feeds into an array
const readData = async () => {
    let feeds = [];
    await getCveFeedFiles().then(data => feeds=data).catch(err => console.log(err));
    const readFeedsPromise = new Promise((resolve, reject) => {
        const cveJsonData = [];
        try {
            feeds.forEach(feed => {
                const rawData = JSON.parse(fs.readFileSync(feed.file));
                cveJsonData.push({
                    name: feed.name,
                    data: rawData["CVE_Items"],
                    timestamp: rawData["CVE_data_timestamp"]
                });
           });
           resolve(cveJsonData);
        } catch(err) {
            reject(err);
        }
    });
    return readFeedsPromise;
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
    return cwes;
};

// Extract CVE Tags
const extractReferenceTags = (entry) => {
    const tags = [];
    entry.cve.references.reference_data.forEach(ref => {
        ref.tags.forEach(tag => {
            tags.push(tag);
        })
    });
    return [...new Set(tags)];
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

// Extract and create CPE Record
const extractCpeRecords = (entry) => {
    const cpes = [];
    const cveId = entry.cve["CVE_data_meta"].ID;
    entry.configurations.nodes.forEach(node => {
        const cpeEntries = node.cpe_match;
        if(cpeEntries && cpeEntries.length > 0) {
            cpeEntries.forEach(cpeEntry => {
                cpes.push({
                    uri: cpeEntry.cpe23Uri,
                    vulnerable: cpeEntry.vulnerable,
                    cveId: cveId
                });
            });
        };
    });
    return [...new Set(cpes)];
};

//Transform CVEs to Records
const transformFeeds = () => {
    const transformsPromise = new Promise((resolve, reject) => {
        const cveRecords = [];
        const cpeRecords = [];
        readData()
        .then(feeds => {
            feeds.forEach(feed => {
                const timestamp = feed.timestamp;
                feed.data.forEach(entry => {
                    let cveRecord = {};
                    cveRecord.timestamp = timestamp
                    cveRecord.id = entry.cve["CVE_data_meta"].ID;
                    cveRecord.assigner = entry.cve["CVE_data_meta"].ASSIGNER;
                    cveRecord.cweId = extractCwe(entry);
                    // CVE References
                    cveRecord.referencesUrls = [...new Set(entry.cve.references.reference_data.map(reference => reference.url))];
                    cveRecord.referencesNames = [...new Set(entry.cve.references.reference_data.map(reference => reference.name))];
                    cveRecord.referencesSources = [...new Set(entry.cve.references.reference_data.map(reference => reference.refsource))];
                    cveRecord.referenceTags = extractReferenceTags(entry);

                    // CVE Descriptions
                    cveRecord.descriptionLanguages = [...new Set(entry.cve.description.description_data.map(desc => desc.lang))];
                    cveRecord.descriptions = entry.cve.description.description_data.map(desc => desc.value);
                    
                    // CPE Configurations
                    cveRecord.cpes = extractCpes(entry);
                    
                    // CVE Impact
                    cveRecord.severity = entry.impact.severity;
                    cveRecord.impactScore = parseFloat(entry.impact.impactScore);
                    cveRecord.exploitabilityScore = parseFloat(entry.impact.exploitabilityScore);
                    cveRecord.obtainAllPrivilege = entry.impact.obtainAllPrivilege;
                    cveRecord.obtainUserPrivilege = entry.impact.obtainUserPrivilege;
                    cveRecord.obtainOtherPrivilege = entry.impact.obtainOtherPrivilege;
                    cveRecord.userInteractionRequired = entry.impact.userInteractionRequired;
                    // CVE Impact cvss V2
                    cveRecord.cvssV2VectorString = null;
                    cveRecord.cvssV2AccessVector = null;
                    cveRecord.cvssV2AccessComplexity = null;
                    cveRecord.cvssV2Authentication = null;
                    cveRecord.cvssV2ConfidentialityImpact = null;
                    cveRecord.cvssV2IntegrityImpact = null;
                    cveRecord.cvssV2AvailabilityImpact = null
                    cveRecord.cvssV2BaseScore = 0.0;
                    if (entry.impact && Object.keys(entry.impact).length > 0 && entry.impact.baseMetricV2 && Object.keys(entry.impact.baseMetricV2).length >0 ) {
                        cveRecord.cvssV2VectorString = entry.impact.baseMetricV2.cvssV2.vectorString;
                        cveRecord.cvssV2AccessVector = entry.impact.baseMetricV2.cvssV2.accessVector;
                        cveRecord.cvssV2AccessComplexity = entry.impact.baseMetricV2.cvssV2.accessComplexity;
                        cveRecord.cvssV2Authentication = entry.impact.baseMetricV2.cvssV2.authentication;
                        cveRecord.cvssV2ConfidentialityImpact = entry.impact.baseMetricV2.cvssV2.confidentialityImpact;
                        cveRecord.cvssV2IntegrityImpact = entry.impact.baseMetricV2.cvssV2.integrityImpact;
                        cveRecord.cvssV2AvailabilityImpact = entry.impact.baseMetricV2.cvssV2.availabilityImpact;
                        cveRecord.cvssV2BaseScore = parseFloat(entry.impact.baseMetricV2.cvssV2.baseScore);

                    }
                    
                    // Create CVE Record
                    cveRecords.push(cveRecord);
                    // Create CPE Records
                    extractCpeRecords(entry).forEach(cpeRec => cpeRecords.push(cpeRec));
                });
            });
            console.log(cpeRecords.length);
            resolve({
                cves: cveRecords,
                cpes: [...new Set(cpeRecords)]
            });
            
        })
        .catch(err => {
            reject(err);
        });
    });
    return transformsPromise;  
};


const generateMutations = async (records) => {
    return await records.map((rec) => {
        return {
            mutation: gql`
                mutation CreateAttackPatterns(
                    $id: Int
                    $name: String
                    $likelihoodOfAttack: String
                    $abstraction: String
                    $status: String
                    $description: String
                    $alternateTerm: String
                    $typicalSeverity: String
                    $childOf: [Int]
                    $peerOf: [Int]
                    $canFollow: [Int]
                    $canPrecede: [Int]
                    $executionFlow: [String]
                    $prerequisites: [String]
                    $skillsRequired: [String]
                    $skillLevels: [String]
                    $resourcesRequired: [String]
                    $indicators: [String]
                    $confidentiality: Boolean!
                    $integrity: Boolean!
                    $availability: Boolean!
                    $accessControl: Boolean!
                    $authorization: Boolean!
                    $mitigations: [String]
                    $exampleInstances: [String]
                    $relatedWeaknesses: [Int]
                    $taxnonomyMappings: [String]
                    $notes: String
                ) {
                    pattern: CreateAttackPattern(
                        id: $id,
                        name: $name,
                        likelihoodOfAttack: $likelihoodOfAttack,
                        abstraction: $abstraction,
                        status: $status,
                        description: $description,
                        alternateTerm: $alternateTerm,
                        typicalSeverity: $typicalSeverity,
                        childOf: $childOf,
                        peerOf: $peerOf,
                        canFollow: $canFollow,
                        canPrecede: $canPrecede,
                        executionFlow: $executionFlow,
                        prerequisites: $prerequisites,
                        skillsRequired: $skillsRequired,
                        skillLevels: $skillLevels,
                        resourcesRequired: $resourcesRequired,
                        indicators: $indicators,
                        confidentiality: $confidentiality,
                        integrity: $integrity,
                        availability: $availability,
                        accessControl: $accessControl,
                        authorization: $authorization,
                        mitigations: $mitigations,
                        exampleInstances: $exampleInstances,
                        relatedWeaknesses: $relatedWeaknesses,
                        taxnonomyMappings: $taxnonomyMappings,
                        notes: $notes
                    ) {
                        id
                    }
                }
            `,
            variables: rec
        }
    })
}

export { transformFeeds };