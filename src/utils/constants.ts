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

export const createChunk = (data: [any]) => {
  const perChunk = 600;
  return data.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/perChunk)
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, []);
}

// Test chunk creation with a Really Large Integer
// console.log(createChunk(Array.from({length: 100999999}, (x, i) => {a: i+1, b: i-1, c: "Hello World"})).length)

