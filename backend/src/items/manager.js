const { generateToken } = require('../utils');

module.exports = {

  getList(db) {
    return db.all('SELECT id, label from items order by label');
  },

  async get(db, id) {
    const [item] = await db.all('SELECT id, label from items WHERE id = ? AND token = ?', [id]);

    return item;
  },

  async add(db, label) {
    const item = {
      id: generateToken(),
      label
    };

    await db.run('INSERT INTO items (id, label, token) VALUES (?, ?, ?)', [item.id, item.label, generateToken()]);

    return item;
  },

  async update(db, { id, label, token }) {
    await db.run(`UPDATE items SET label = ? WHERE id = ? and token = ? `, [label, id, token]);
  },

  async remove(db, { id, token }) {
    await db.run(`DELETE FROM items WHERE id = ? and token = ? `, [id, token]);
  }
};
