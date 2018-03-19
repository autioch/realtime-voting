const { generateToken } = require('./utils');

let nextId = 1;

module.exports = class Cols {
  constructor() {
    this.cols = [];
  }

  getCol(colId) {
    return this.cols.find((col) => col.id === colId);
  }

  validateCol(colId, token) {
    const col = this.getCol(colId);

    return !!col && col.token === token;
  }

  serializeToFrontend() {
    return this.cols.map(({ id, label }) => ({
      id,
      label
    }));
  }

  getCredentials(colId) {
    const col = this.getCol(colId);

    return {
      id: col.id,
      token: col.token,
      label: col.label
    };
  }

  getExistingCol({ id, token, label }) {
    const numberId = parseInt(id, 10);

    return this.cols.find((col) => col.id === numberId && col.token === token && col.label === label);
  }

  addCol(userCredentials) {
    const existingCol = this.getExistingCol(userCredentials);

    if (existingCol) {
      existingCol.token = generateToken();

      return existingCol;
    }

    console.log(this.cols.map((column) => Object.values(column)));
    const col = {
      id: nextId++, // eslint-disable-line no-plusplus
      label: 'Anonymous',
      token: generateToken()
    };

    this.cols.push(col);

    return col;
  }

  renameCol(colId, label) {
    const col = this.getCol(colId);

    console.log(col);
    if (col) {
      col.label = label;
    }
  }

  removeCol(colId) {
    this.cols = this.cols.filter((col) => col.id !== colId);
  }
};
