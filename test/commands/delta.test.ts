import {expect, test} from '@oclif/test'

describe('delta', () => {
  test
  .stdout()
  .command(['delta'])
  .it('runs delta', ctx => {
    expect(ctx.stdout).to.contain('Delta is completed')
  })
})
