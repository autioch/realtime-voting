const Bluebird = require('bluebird');

module.exports = Bluebird.promisifyAll(require('fs'));
