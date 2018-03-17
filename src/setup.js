const express = require('express');
const bodyParser = require('body-parser');
const qbLog = require('qb-log');
const path = require('path');
const errors = require('./errors');

module.exports = function setup(controllers) {
  qbLog.info('Setting up backend application...');
  const app = express();

  /* Server static files */
  app.use(express.static(path.join(__dirname, 'static')));

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

  /* Use controllers */
  const actionCount = controllers.reduce((count, controller) => {
    controller.forEach((action) => app[action.method](action.path, action.handler));

    return count + controller.length;
  }, 0);

  qbLog.info(`Registered ${actionCount} actions.`);

  /* Handle errors */
  app.use(errors);
  qbLog.info('Backend application ready.');

  return app;
};
