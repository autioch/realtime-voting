/* eslint-disable no-unused-expressions */
const thenifyAll = require('thenify-all');
const qbLog = require('qb-log')('simple');

const methods = ['close', 'get', 'all', 'exec'];

const DEBOG_SQL = false;

module.exports = class Wrapper {
  constructor(db) {
    this.db = db;
    const wrapped = thenifyAll(db, {}, methods);

    for (const method of methods) {
      this[method] = wrapped[method].bind(db);
    }
  }

  prepare(sql, params) {
    return new Promise((resolve, reject) => {
      const statement = this.db.prepare(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(statement);
        }
      });
    });
  }

  each(sql, params, onRow) {
    return new Promise((resolve, reject) => {
      let done = false;

      const rowCallback = (err, row) => {
        if (done) {
          return;
        }

        if (err) {
          DEBOG_SQL && qbLog.error(`SQL ERROR: ${err} in ${sql}.`);
          done = true;
          reject(err);

          return;
        }

        onRow(row);
      };

      const completionCallback = (err, count) => {
        if (err) {
          DEBOG_SQL && qbLog.error(`SQL ERROR: ${err} in ${sql}.`);
          reject(err);

          return;
        }

        resolve(count);
      };

      this.db.each(sql, params, rowCallback, completionCallback);
    });
  }

  run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        DEBOG_SQL && qbLog.info(`RUN: ${sql}, ${JSON.stringify(params)}`);

        if (err) {
          qbLog.error(`ERROR: ${err} in ${sql}.`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
