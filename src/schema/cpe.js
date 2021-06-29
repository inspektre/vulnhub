import { gql } from 'apollo-server-micro';

export const Cpe = gql`
  type Cpe {
    uri: String
    vulnerable: Boolean
    cveId: String
  }
`