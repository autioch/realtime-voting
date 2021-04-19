const { HTTP_STATUS: { OK } } = require('../consts');
const manager = require('./manager');

module.exports = [{
  path: '/choices',
  method: 'get',
  handler: (db) => async (req, res) => {
    const items = await manager.getList(db);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(items, null, ' '));
  }
}, {
  path: '/choices',
  method: 'post',
  handler: (db) => async (req, res) => {
    const { voterId, token, itemId } = req.params;
    const item = await manager.set(db, voterId, token, itemId);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(item, null, ' '));
  }
}, {
  path: '/choices',
  method: 'delete',
  handler: (db) => async (req, res) => {
    const { voterId, token } = req.params;
    const item = await manager.remove(db, voterId, token);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(item, null, ' '));
  }
}];
