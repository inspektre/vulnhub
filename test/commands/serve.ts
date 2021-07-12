import {expect, test} from '@oclif/test'

describe('serve', () => {
  test
  .stdout()
  .command(['serve'])
  .it('runs serve', ctx => {
    expect(ctx.stdout).to.contain('Starting GraphQl server 4000');
    expect(ctx.stdout).to.contain('🚀 GraphQL Server is now ready');
  })
})
