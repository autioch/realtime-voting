const { info, error, empty } = require('qb-log');
const socketIo = require('socket.io');
const http = require('http');
const { join } = require('path');
const express = require('express');
const restaurants = require('./restaurants');

let nextId = 1;

function generateToken() {
  let token = '';

  while (token.length < 20) { // eslint-disable-line no-magic-numbers
    token += Math.random().toString();
  }

  return token;
}

module.exports = class App {
  constructor({ port }) {
    const app = express();

    app.use(express.static(join(__dirname, '..', 'static')));

    const server = http.Server(app);// eslint-disable-line new-cap

    this.cols = [];
    this.io = socketIo(server);
    this.io.on('connection', (socket) => this.connectCol(socket));

    server.listen(port, () => info(`Listening on PORT ${port}`));
  }

  connectCol(socket) {
    const col = this.addCol();

    socket.on('disconnect', () => this.removeCol(col));
    socket.on('col:rename', this.renameCol.bind(this));
    socket.on('row:choose', this.chooseRow.bind(this));

    socket.emit('col:connected', col.id, col.token, col.label);
    this.io.emit('col:added', col.id, col.label);
    socket.emit('row:list', restaurants);
    socket.emit('col:list', this.cols.map(({ id, label }) => ({
      id,
      label
    })));
  }

  addCol() {
    const col = {
      id: nextId++, // eslint-disable-line no-plusplus
      label: 'Anonymous',
      token: generateToken()
    };

    this.cols.push(col);

    info('User connected', col.id);

    return col;
  }

  chooseRow(token, colId, rowId) {
    if (!this.validateCol(colId, token)) {
      return;
    }
    this.io.emit('row:chosen', colId, rowId);
    info('Row chosen', colId, rowId);
  }

  validateCol(colId, token) {
    const col = this.cols.find((column) => column.id === colId);

    if (!col) {
      error('User authentication failed - unkown user');

      return false;
    }
    if (col.token !== token) {
      error('User authentication failed', col.id, col.label);
      empty(col.token, token);
      const hackingUser = this.cols.find((hacker) => hacker.token === token);

      if (hackingUser) {
        error('Hacker identified by a token', col.id, col.label);
      } else {
        error('Unkown token');
      }

      return false;
    }

    return true;
  }

  renameCol(token, colId, label) {
    if (!this.validateCol(colId, token)) {
      return;
    }
    const col = this.cols.find((column) => column.id === colId);

    col.label = label;
    this.io.emit('col:renamed', colId, label);
    info('Col renamed', colId, label);
  }

  removeCol(colToRemove) {
    this.cols = this.cols.filter((col) => col !== colToRemove);
    this.io.emit('col:removed', colToRemove.id);
    info('Col removed', colToRemove.id, colToRemove.label);
  }
};
