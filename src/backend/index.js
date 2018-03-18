const { info } = require('qb-log');
const socketIo = require('socket.io');
const rows = require('./rows');
const Cols = require('./cols');

module.exports = class App {
  constructor({ port, server }) {
    this.cols = new Cols();
    this.choices = {};
    this.io = socketIo(server);
    this.io.on('connection', (socket) => this.connectCol(socket));
    server.listen(port, () => info(`Listening on PORT ${port}`));
  }

  connectCol(socket) {
    const col = this.cols.addCol();

    socket.on('disconnect', () => this.removeCol(col));
    socket.on('col:rename', this.renameCol.bind(this));
    socket.on('row:choose', this.chooseRow.bind(this));

    socket.emit('col:connected', col.id, col.token, col.label);
    this.io.emit('col:added', col.id, col.label);
    socket.emit('row:list', rows);
    socket.emit('col:list', this.cols.serializeToFrontend());
    socket.emit('choices', this.choices);
  }

  chooseRow(token, colId, rowId) {
    if (!this.cols.validateCol(colId, token)) {
      return;
    }
    this.choices[colId] = rowId;
    this.io.emit('row:chosen', colId, rowId);
    info('Row chosen', colId, rowId);
  }

  renameCol(token, colId, label) {
    if (!this.cols.validateCol(colId, token)) {
      return;
    }
    this.cols.renameCol(colId, label);
    this.io.emit('col:renamed', colId, label);
    info('Col renamed', colId, label);
  }

  removeCol(colToRemove) {
    this.cols.removeCol(colToRemove.id);
    this.io.emit('col:removed', colToRemove.id);
    info('Col removed', colToRemove.id, colToRemove.label);
  }
};
