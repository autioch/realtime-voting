const { HTTP_STATUS: { OK } } = require('../consts');
const manager = require('./manager');

module.exports = [{
  path: '/items',
  method: 'get',
  handler: (db) => async (req, res) => {
    const items = await manager.getList(db);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(items, null, ' '));
  }
}, {
  path: '/items',
  method: 'post',
  handler: (db) => async (req, res) => {
    const { label } = req.params;
    const item = await manager.add(db, label);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(item, null, ' '));
  }
}];
