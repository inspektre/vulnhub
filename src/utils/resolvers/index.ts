import { ForbiddenError } from "apollo-server";

// CVE Seeding creates or modifies CVEs.
// Please be sure that you are aware of what you are doing
// Inspektre default behaviours disallows user-creation of CVEs
export const resolvers = {
  Mutation: {
    async createCves(parent: any, args?: any, ctx?: any, info?: any) {
      return new ForbiddenError('Unauthorized.');
    },
    async updateCves(parent: any, args?: any, ctx?: any, info?: any) {
      return new ForbiddenError('Unauthorized.');
    },
    async deleteCves(parent: any, args?: any, ctx?: any, info?: any) {
      return new ForbiddenError('Unauthorized.');
    }
  }
};