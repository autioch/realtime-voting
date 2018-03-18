module.exports = function generateToken() {
  let token = '';

  while (token.length < 20) { // eslint-disable-line no-magic-numbers
    token += Math.random().toString();
  }

  return token;
};
