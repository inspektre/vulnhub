import { homedir } from 'os';

export const BASE_DIR = `${homedir()}/.config/inspektre/feeds/cve`;

// All retrospective CVEs
export const CVE_FEEDS = Array.from({length: new Date().getFullYear() - 2001}, (_, i) => {
  const idx = 2001+i+1;
  return { 
    idx: idx.toString(),
    uri : `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${idx}.json.gz`,
    compressed: `${BASE_DIR}/nvdcve-1.1-${idx}.json.gz`,
    json: `${BASE_DIR}/nvdcve-1.1-${idx}.json`
  }
});

// Modified CVEs
export const UPDATE_CVE_FEEDS_MODIFIED = { 
  idx: 'modified',
  uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json.gz',
  compressed: `${BASE_DIR}/nvdcve-1.1-modified.json.gz`,
  json: `${BASE_DIR}/nvdcve-1.1-modified.json`
};

// Latest Releases of CVEs
export const UPDATE_CVE_FEEDS_RECENT = { 
  idx: 'recent', 
  uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-recent.json.gz',
  compressed: `${BASE_DIR}/nvdcve-1.1-recent.json.gz`,
  json: `${BASE_DIR}/nvdcve-1.1-recent.json`
};

const x = CVE_FEEDS;
x.push(UPDATE_CVE_FEEDS_MODIFIED);
x.push(UPDATE_CVE_FEEDS_RECENT);
export const DOWNLOAD_FEEDS = x;

// CPEs are large text dictionaries as Array in a CVE
// BTREE strategy won't work or is not benefitial for us.
// `CREATE INDEX cve_cpe_index IF NOT EXISTS FOR (c:Cve) ON (c.cpes)`,
// To-Do: Break down CPEs to individual arrays and index arrays - Array of Orgs, Array of Version, Array of Products
export const CREATE_CVE_INDICES = [
  `CREATE INDEX cve_id_index IF NOT EXISTS FOR (c:Cve) ON (c.id)`,
  `CREATE INDEX cve_year_index IF NOT EXISTS FOR (c:Cve) ON (c.year)`,
  `CREATE INDEX cve_cwe_index IF NOT EXISTS FOR (c:Cve) ON (c.cwes)`,
  `CREATE INDEX cve_severity_index IF NOT EXISTS FOR (c:Cve) ON (c.severity)`,
  `CREATE INDEX cve_impactscore_index IF NOT EXISTS FOR (c:Cve) ON (c.impactScore)`,
  `CREATE INDEX cve_exploitability_score_index IF NOT EXISTS FOR (c:Cve) ON (c.exploitabilityScore)`,
  `CREATE INDEX cve_base_score_index IF NOT EXISTS FOR (c:Cve) ON (c.baseScore)`,
];

const SEARCH_STMT = `MATCH (n:Cve)-->(n1:Cve) WHERE n.id CONTAINS "CVE-2021-22210" RETURN n.id, n1.id, n.exploitabilityScore,n1.exploitabilityScore`;
const STMT = `MATCH (c1:Cve), (c2:Cve) WHERE c1.year=2017 AND c2.year=2021 AND NOT(c1.id=c2.id) AND NOT(c1.cwes=c2.cwes=[]) AND any(cwe in c1.cwes WHERE cwe in c2.cwes) MERGE (c1)-[:CWE]-(c2);`;
const years = Array.from({length: new Date().getFullYear() - 2001}, (_, i) => 2001+i+1);
// export const CREATE_CWE_RELATION = years.map(year => `MATCH (c1:Cve), (c2:Cve) WHERE c1.year=${year} AND NOT(c1.id=c2.id) AND c1.cwes AND c2.cwes AND single(cwe in c1.cwes WHERE c2.cwes CONTAINS cwe) MERGE (c1)-[:CWE]-(c2);`);
export const CREATE_CWE_RELATION = years.map(year => `MATCH (c1:Cve), (c2:Cve) WHERE c1.year=${year} AND NOT(c1.id=c2.id) AND NOT(c1.cwes=[]) AND NOT(c2.cwes=[]) AND any(cwe in c1.cwes WHERE cwe in c2.cwes) MERGE (c1)-[:CWE]-(c2);`);

export const CREATE_CVE = `UNWIND $cypherList AS i MERGE (c:Cve
  { 
    id: i.id,
    year: i.year,
    cwes: i.cwes,
    cpes: i.cpes,
    severity: i.severity,
    impactScore: i.impactScore,
    exploitabilityScore: i.exploitabilityScore,
    baseScore: i.baseScore
  }) ON MATCH SET c.id = i.id, c.cwes=i.cwes, c.cpes=i.cpes, c.severity=i.severity, c.impactScore=i.impactScore, c.exploitabilityScore=i.exploitabilityScore, c.baseScore=i.baseScore;
`;

export const CVE_INDEX = 'CREATE INDEX cve_index IF NOT EXISTS FOR (n:Cve) ON (n.Cve)';

// Test chunk creation with a Really Large Integer
// console.log(createChunk(Array.from({length: 100999999}, (x, i) => {a: i+1, b: i-1, c: "Hello World"})).length)
export const createChunk = (data: [any]) => {
  const perChunk = 700;
  return data.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/perChunk)
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, []);
};