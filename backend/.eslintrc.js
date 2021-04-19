module.exports = {
  "extends": [
    "react-app",
    "qb"
  ],
  rules: {
    'no-magic-numbers': ['error', {
      ignore: [0, 1, 10, 500]
    }],
    'no-unused-vars': ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    'id-blacklist': ['off'],
    'jsx-a11y/href-no-hash': ['off'],
    'no-plusplus': ['off'],
    'id-length': ['off'],
    'no-await-in-loop': ['off'],
    'max-len': ['warn', 140]
  }
};
