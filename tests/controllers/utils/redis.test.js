/* eslint-disable import/no-named-as-default */
import { expect } from 'chai';
// eslint-disable-next-line import/no-unresolved, import/extensions
import redisClient from '../../utils/redis';

describe('+ RedisClient utility', () => {
  // eslint-disable-next-line func-names, no-undef
  before(function (done) {
    this.timeout(10000);
    setTimeout(done, 4000);
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it('+ Client is alive', () => {
    // eslint-disable-next-line jest/valid-expect
    expect(redisClient.isAlive()).to.equal(true);
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it('+ Setting and getting a value', async () => {
    await redisClient.set('test_key', 345, 10);
    expect(await redisClient.get('test_key')).to.equal('345');
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it('+ Setting and getting an expired value', async () => {
    await redisClient.set('test_key', 356, 1);
    setTimeout(async () => {
      expect(await redisClient.get('test_key')).to.not.equal('356');
    }, 2000);
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it('+ Setting and getting a deleted value', async () => {
    await redisClient.set('test_key', 345, 10);
    await redisClient.del('test_key');
    setTimeout(async () => {
      console.log('del: test_key ->', await redisClient.get('test_key'));
      // eslint-disable-next-line no-unused-expressions
      expect(await redisClient.get('test_key')).to.be.null;
    }, 2000);
  });
});
