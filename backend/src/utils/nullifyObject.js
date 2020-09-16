module.exports = function nullifyObject(obj) {
  if (obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        obj[prop] = null;
      }
    }
  }
};
