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
    'jsx-a11y/href-no-hash': ['off']
  }
};
