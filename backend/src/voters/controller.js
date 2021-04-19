const { HTTP_STATUS: { OK } } = require('../consts');
const manager = require('./manager');

module.exports = [{
  path: '/voters',
  method: 'get',
  handler: (db) => async (req, res) => {
    const items = await manager.getList(db);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(items, null, ' '));
  }
}, {
  path: '/voters',
  method: 'post',
  handler: (db) => async (req, res) => {
    const { label } = req.params;
    const item = await manager.add(db, label);

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(item, null, ' '));
  }
}, {
  path: '/voters/:id/:token',
  method: 'delete',
  handler: (db) => async (req, res) => {
    const { id, token } = req.params;

    await manager.remove(db, {
      id,
      token
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(true, null, ' '));
  }
}, {
  path: '/voters/:id/:token/:label',
  method: 'patch',
  handler: (db) => async (req, res) => {
    const { id, token, label } = req.params;

    await manager.update(db, {
      id,
      token,
      label
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(OK).send(JSON.stringify(true, null, ' '));
  }
}];
