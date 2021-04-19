const { generateToken } = require('../utils');

module.exports = {
  getList(db) {
    return db.all('SELECT id, label from voters order by label');
  },

  async get(db, id) {
    const [item] = await db.all('SELECT id, label from voters WHERE id = ? AND token = ?', [id]);

    return item;
  },

  async add(db, label) {
    const item = {
      id: generateToken(),
      label
    };

    await db.run('INSERT INTO voters (id, label, token) VALUES (?, ?, ?)', [item.id, item.label, generateToken()]);

    return item;
  },

  async update(db, { id, label, token }) {
    await db.run(`UPDATE voters SET label = ? WHERE id = ? and token = ? `, [label, id, token]);
  },

  async remove(db, { id, token }) {
    await db.run(`DELETE FROM voters WHERE id = ? and token = ? `, [id, token]);
  }
};
