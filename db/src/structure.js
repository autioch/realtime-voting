const fs = require('fs').promises;
const { join } = require('path');

module.exports = async function getStructure(db) {
  const tables = await db.all('SELECT name, sql FROM sqlite_master WHERE type =\'table\' AND name NOT LIKE \'sqlite_%\';');

  const cleaned = tables.map(({ name, sql }) => { // eslint-disable-line no-shadow
    const columns = sql
      .split('\n')
      .slice(1) // create statement
      .map((col) => col.replace(',', '').replace(')', '').trim())
      .filter(Boolean);

    return {
      name,
      columns
    };
  });

  await fs.writeFile(join(__dirname, '..', 'structure.json'), JSON.stringify(cleaned, null, ' '));
};
