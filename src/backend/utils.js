const fs = require('bluebird').promisifyAll(require('fs'));
const { join } = require('path');

module.exports = {

  writeFile(fileName, data) {
    const fullName = join(__dirname, 'db', `${fileName}.json`);

    return fs.writeFileAsync(fullName, JSON.stringify(data, null, '  '), 'utf8');
  },

  readFile(fileName) {
    const fullName = join(__dirname, 'db', `${fileName}.json`);

    return fs.readFileAsync(fullName, 'utf8');
  }

};
