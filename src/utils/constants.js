import { homedir } from 'os';

const BASE_DIR = `${homedir()}/.config/inspektre/feeds/cve`;

// All retrospective CVEs
const CVE_FEEDS = Array.from({length: new Date().getFullYear() - 2001}, (_, i) => {
  const idx = 2001+i+1;
  return { 
    idx,
    uri : `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${idx}.json.gz`,
    compressed: `${BASE_DIR}/nvdcve-1.1-${idx}.json.gz`,
    json: `${BASE_DIR}/nvdcve-1.1-${idx}.json`
  }
});

// Modified CVEs
CVE_FEEDS.push({ 
  idx: 'modified',
  uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json.gz',
  compressed: `${BASE_DIR}/nvdcve-1.1-modified.json.gz`,
  json: `${BASE_DIR}/nvdcve-1.1-modified.json`
});

// Latest Releases of CVEs
CVE_FEEDS.push({ 
  idx: 'recent', 
  uri: 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-recent.json.gz',
  compressed: `${BASE_DIR}/nvdcve-1.1-recent.json.gz`,
  json: `${BASE_DIR}/nvdcve-1.1-recent.json`
});



export const CREATE_CVE = `UNWIND $cypherList AS i MERGE (c:Cve
  { 
    id: i.id
    cwes: i.cwes
    cpes: i.cpes
    severity: i.severity
    impactScore: i.impactScore
    exploitabilityScore: i.exploitabilityScore
    baseScore: i.baseScore
    createdAt: datetime(),
    updatedAt: datetime()
  }
  ON MATCH SET c.id = i.id, c.cwes=i.cwes, c.cpes=i.cpes, c.severity=i.severity, 
  c.impactScore=i.impactScore, c.exploitabilityScore=i.exploitabilityScore, 
  c.baseScore=i.baseScore, c.updatedAt=datetime()
)`;

module.exports = {
  BASE_DIR,
  CVE_FEEDS,
  CREATE_CVE
}