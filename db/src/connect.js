const sqlite3 = require('sqlite3');

module.exports = function connect(filename) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};
