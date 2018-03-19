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
    const { handshake = {} } = socket;
    const { query = {} } = handshake;

    const col = this.cols.addCol(query);

    socket.on('col:exit', () => this.removeCol(socket, col));
    socket.on('col:rename', this.renameCol.bind(this));
    socket.on('row:choose', this.chooseRow.bind(this));

    socket.emit('col:connected', this.cols.getCredentials(col.id));
    socket.emit('row:list', rows);
    this.io.emit('col:list', this.cols.serializeToFrontend());
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

  removeCol(socket, colToRemove) {
    socket.emit('row:list', []);
    socket.emit('col:list', []);
    this.cols.removeCol(colToRemove.id);
    this.io.emit('col:removed', colToRemove.id);
    info('Col removed', colToRemove.id, colToRemove.label);
  }
};
