/* eslint-disable no-magic-numbers */
const qbLog = require('qb-log');

qbLog({
  update: {
    prefix: 'UPDATE',
    formatter: qbLog._chalk.cyan // eslint-disable-line no-underscore-dangle
  }
});

async function getVersion(db) {
  const rows = await db.all('SELECT version FROM config LIMIT 1');

  const [row] = rows;
  const { version } = row;

  return version;
}

module.exports = async function update(db, migrations) {
  let version = await getVersion(db);

  async function bumpVersion() {
    qbLog.update(`From version ${version} to version ${version + 1}`);
    version = version + 1;
    await db.run(`UPDATE config SET version = ?`, [version]);
  }

  // App is by default in version 1 and migrations are indexed from 0.
  const appliedMigrations = version - 1;
  const totalMigrations = migrations.length;
  const pendingMigrations = totalMigrations - appliedMigrations;

  qbLog.update('Migrations pending', pendingMigrations);

  for (let index = appliedMigrations; index < totalMigrations; index++) {
    const migrationFn = migrations[index];

    qbLog.update('Current version', version);
    qbLog.update(`Migration ${index}, ${migrationFn.name}`);

    await migrationFn(db);
    await bumpVersion();
  }
};
