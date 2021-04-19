const { EVENTS } = require('../consts');

module.exports = [
  {
    eventName: EVENTS,
    handler: (db) => async () => {
      const items = await manager.getList(db);
    }
  }
];
