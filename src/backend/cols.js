const { generateToken } = require('./utils');

let nextId = 1;

module.exports = class Cols {
  constructor() {
    this.cols = [];
  }

  getCol(colId) {
    return this.find((col) => col.id === colId);
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

  addCol() {
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

    if (col) {
      col.label = label;
    }
  }

  removeCol(colId) {
    this.cols = this.cols.filter((col) => col.id !== colId);
  }
};
