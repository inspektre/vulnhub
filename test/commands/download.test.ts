import {expect, test} from '@oclif/test'

describe('download', () => {
  test
  .stdout()
  .command(['download'])
  .it('runs download', ctx => {
    expect(ctx.stdout).to.contain('Downloading Feeds to:')
  })
})
