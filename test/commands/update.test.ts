import {expect, test} from '@oclif/test'

describe('update', () => {
  test
  .stdout()
  .command(['update'])
  .it('runs update', ctx => {
    expect(ctx.stdout).to.contain('Delta is completed')
  })
})
