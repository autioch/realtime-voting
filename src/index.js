const BackendApp = require('./backend');
const express = require('express');
const { join } = require('path');
const http = require('http');
const port = 9090;

const app = express();

app.use(express.static(join(__dirname, '..', 'static')));

const server = http.Server(app);// eslint-disable-line new-cap

new BackendApp({ // eslint-disable-line no-new
  port,
  server
});
