module.exports = {
  getList(db) {
    return db.all('SELECT item_id, voter_id from choices');
  },

  async validateVoter(db, voterId, token) {
    const voters = await db.all('SELECT id from choices WHERE id = ? and token = ?', [voterId, token]);

    if (voters.length !== 1) {
      throw Error('Invalid user credentials.');
    }
  },

  async set(db, voterId, token, itemId) {
    await this.remove(voterId, token);
    await db.run('INSERT INTO choices (item_id, voter_id, datetime) VALUES (?, ?, ?)', [itemId, voterId, new Date().toISOString()]);
  },

  async remove(db, voterId, token) {
    await this.validateVoter(voterId, token);
    await db.run(`DELETE FROM choices WHERE voter_id = ?`, [voterId]);
  }
};
