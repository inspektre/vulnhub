import { gql } from 'apollo-server-micro';

export default Cve = gql`
  type Cve {
    id: String
    cwes: [Int]
    cpes: [String]
    severity: String
    impactScore: Float
    exploitabilityScore: Float
    baseScore: Float
  }
`