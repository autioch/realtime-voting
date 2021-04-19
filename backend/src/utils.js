const fs = require('bluebird').promisifyAll(require('fs'));
const { join } = require('path');
const crypto = require('crypto');  //eslint-disable-line

module.exports = {

  writeFile(fileName, data) {
    const fullName = join(__dirname, 'db', `${fileName}.json`);

    return fs.writeFileAsync(fullName, JSON.stringify(data, null, '  '), 'utf8');
  },

  readFile(fileName) {
    const fullName = join(__dirname, 'db', `${fileName}.json`);

    return fs.readFileAsync(fullName, 'utf8');
  },

  generateToken() {
    return crypto.randomBytes(32).toString('hex'); // eslint-disable-line no-magic-numbers
  }

};
