/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-magic-numbers */
const { expect } = require('chai');
const install = require('./install');
const dbMock = require('../mock');

describe('db install', () => {
  let db;

  beforeEach(async () => {
    db = await dbMock(false);
  });

  afterEach(async () => {
    await db.close();
  });

  it(`does not throw`, (done) => {
    expect(async () => {
      await install(db);
      done();
    }).to.not.throw();
  });
});
