const { info, error } = require('qb-log');
const socketIo = require('socket.io');
const { debounce } = require('lodash');
const Bluebird = require('bluebird');

const onQuit = require('on-quit/src');
const Dimension = require('./dimension');
const Choices = require('./choices');
const EVENTS = require('../frontend/src/events');

const SAVE_DEBOUNCE = 5000;

module.exports = class App {
  constructor() {
    this.cols = new Dimension({
      id: 'cols'
    });
    this.rows = new Dimension({
      id: 'rows'
    });
    this.choices = new Choices();
    this.saveDebounced = debounce(this.save.bind(this), SAVE_DEBOUNCE);
  }

  start({ port, server }) {
    info('Starting...');

    return Bluebird
      .join(

        // this.cols.readFromFile(),
        this.rows.readFromFile(),
        this.choices.readFromFile()
      )
      .then(() => {
        info('Setting up server and sockets...');
        this.io = socketIo(server);
        this.io.on('connection', (socket) => this.connectCol(socket));
        server.listen(port, () => {
          onQuit(this.save.bind(this));
          info(`Listening on ${port}`);
        });
      })
      .catch((err) => {
        error('Failed to start.');
        error(err.message);
      });
  }

  connectCol(socket) {
    const { handshake = {} } = socket;
    const col = this.cols.login(handshake.query);

    info('connectCol', col.id, col.label);

    socket.on(EVENTS.COL_EXIT, (credentials) => this.exitCol(credentials, socket));
    socket.on(EVENTS.COL_RENAME, this.renameCol.bind(this));
    socket.on(EVENTS.ROW_CHOOSE, this.chooseRow.bind(this));

    socket.emit(EVENTS.COL_CONNECTED, col);
    socket.emit(EVENTS.CHOICES, this.choices.serializeToFrontend());
    socket.emit(EVENTS.ROW_LIST, this.rows.serializeToFrontend());
    this.io.emit(EVENTS.COL_LIST, this.cols.serializeToFrontend());
    this.saveDebounced();
  }

  renameCol(credentials, label) {
    info('renameCol', credentials.id, credentials.label, label);
    if (this.cols.verify(credentials)) {
      this.cols.rename(credentials.id, label);
      this.saveDebounced();
    }
    this.io.emit(EVENTS.COL_LIST, this.cols.serializeToFrontend());
  }

  chooseRow(credentials, rowId) {
    info('chooseRow', credentials.id, credentials.label, rowId);
    if (this.cols.verify(credentials)) {
      this.choices.set(credentials.id, rowId);
      this.saveDebounced();
    }
    this.io.emit(EVENTS.CHOICES, this.choices.serializeToFrontend());
  }

  exitCol(credentials, socket) {
    info('exitCol', credentials.id, credentials.label);
    if (this.cols.verify(credentials)) {
      this.cols.exit(credentials.id);
      this.saveDebounced();
      socket.emit(EVENTS.COL_LIST, []);
      socket.broadcast.emit(EVENTS.COL_LIST, this.cols.serializeToFrontend());
    } else {
      this.io.emit(EVENTS.COL_LIST, this.cols.serializeToFrontend());
    }
  }

  save() {
    return Bluebird.join(
      this.cols.writeToFile(),
      this.rows.writeToFile(),
      this.choices.writeToFile()
    );
  }
};
