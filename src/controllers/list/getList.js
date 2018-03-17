const { httpStatus: { OK, SERVER_ERROR } } = require('src/utils');
const Bluebird = require('bluebird');

module.exports = function getList(req, res) {
  return Bluebird
    .delay(500)
    .then(() => {
      res.setHeader('Content-Type', 'text/javascript');
      res.status(OK).send(JSON.stringify([{
        id: 1,
        label: 'First'
      }]));
    })
    .catch((err) => res.status(SERVER_ERROR).send({
      error: `Galleries not found.\n${err.message}`
    }));
};
