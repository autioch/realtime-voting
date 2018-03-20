const BackendApp = require('./backend');
const express = require('express');
const { join } = require('path');
const http = require('http');

const app = express();

app.use(express.static(join(__dirname, '..', 'static')));

new BackendApp().start({
  port: 9090,
  server: http.Server(app) // eslint-disable-line new-cap
});
