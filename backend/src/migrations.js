/* eslint-disable no-magic-numbers */
const { generateToken } = require('./utils');

module.exports = [

  async function setup(db) {
    await db.run(`CREATE TABLE items (
      id TEXT NOT NULL,
      label TEXT NOT NULL,
      token TEXT NOT NULL
    )`);

    await db.run(`CREATE TABLE voters (
      id TEXT NOT NULL,
      label TEXT NOT NULL,
      token TEXT NOT NULL
    )`);

    await db.run(`CREATE TABLE choices (
      item_id TEXT NOT NULL,
      voter_id TEXT NOT NULL,
      datetime TEXT NOT NULL
    )`);
  },

  async function seedRestaurants(db) {
    const items = [
      'Labija',
      'Chińczyk',
      'Kura warzyw',
      'Gołe baby',
      'McDonald',
      'Foodie',
      '4 Alternatywy',
      'Rico\'s kitchen',
      'Bazar',
      'Meat us',
      'Zdolni',
      'Baraboo',
      'Piwnica'
    ].sort((a, b) => a.localeCompare(b));

    for (let i = 0; i < items.length; i++) {
      await db.run('INSERT INTO images (id, label, token) VALUES (?, ?, ?, ?)', [generateToken(), items[i], generateToken()]);
    }
  }

];
