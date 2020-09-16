const diacriticsRemovalMap = require('./diacriticsRemovalMap');

// normalizes given string using diacristicsRemovalMap
module.exports = function normalizeText(originalText) {
  return diacriticsRemovalMap
    .reduce((normalized, change) => normalized.replace(change.letters, change.base), originalText.toLowerCase())
    .replace(/[^\w\s]/gi, '');
};
