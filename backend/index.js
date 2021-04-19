require('app-module-path').addPath('.');
const qbLog = require('qb-log')('simple');

const setupControllers = require('./src/setupControllers');
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('http');
const { backendPort } = require('../config');
const cors = require('cors');
const setupDb = require('../db');
const { join } = require('path');
const socketIo = require('socket.io');

async function setupServer() {
  const db = await setupDb(join(__dirname, 'db'));

  qbLog.info('Setting up server...');

  const app = express();

  app.use(cors());

  /* Required for body content */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  /* Log all requests in the console. */
  app.all('*', (req, res, next) => { // eslint-disable-line no-unused-vars
    qbLog.info(req.url);
    next();
  });

  setupControllers(app, db);

  const readyServer = Server(app); // eslint-disable-line new-cap

  const io = socketIo(readyServer);

  io.on('connection', (socket) => this.connectCol(socket));

  qbLog.info('Backend application ready.');

  app.listen(backendPort, () => qbLog.info(`Listening on PORT ${backendPort}`));
}

(async() => {
  await setupServer();
})();
