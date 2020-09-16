require('app-module-path').addPath('.');
require('qb-log')('simple');

const BackendApp = require('./app');
const express = require('express');
const { Server } = require('http');
const { backendPort } = require('../../config');

const app = express();

new BackendApp().start({
  port: backendPort,
  server: Server(app) // eslint-disable-line new-cap
});
