/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-magic-numbers */
const { expect } = require('chai');
const connect = require('./connect');

describe('db connect', () => {
  let db;

  afterEach(async () => {
    await db.close();
    db = null;
  });

  describe('setup', () => {
    it(`does not throw`, (done) => {
      expect(async () => {
        db = await connect(':memory:');
        done();
      }).to.not.throw();
    });
  });
});
