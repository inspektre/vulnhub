const { gql } = require('apollo-server');

const Cve = gql`
  type Cve @auth(rules: [{ operations: [READ], isAuthenticated: false }]) {
    """CVE ID """
    id: String
    """ CVE Year """
    year: Int
    """ CVE is associated with [WeaknessPattern] """
    cwes: [Int] 
    """ CVE is associated with [Cpe] """
    cpes: [String] 
    """ CVE Severity: Critical/ High / Medium / Low """
    severity: String 
    """ CVE Impact score """
    impactScore: Float
    """ CVE exploitability score """
    exploitabilityScore: Float
    """ CVE base score """
    baseScore: Float
  }
`;

const typeDefs = [
  Cve
];

module.exports = typeDefs;