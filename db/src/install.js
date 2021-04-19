module.exports = async function install(db) {
  await db.run(`CREATE TABLE config (
    version INT NOT NULL
  )`);

  await db.run('INSERT INTO config (version) VALUES (?)', 1);
};
