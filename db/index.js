const qbLog = require('qb-log');
const connect = require('./src/connect');
const install = require('./src/install');
const update = require('./src/update');
const Wrapper = require('./src/wrapper');
const structure = require('./src/structure');

async function isInstalled(db) {
  const info = await db.all('SELECT * FROM sqlite_master');

  return !!info.length;
}

qbLog({
  install: {
    prefix: 'INSTALL',
    formatter: qbLog._chalk.cyan // eslint-disable-line no-underscore-dangle
  }
});

async function setupDb(filePath, migrations = []) {
  const rawDb = await connect(filePath);
  const db = new Wrapper(rawDb);
  const isReady = await isInstalled(db);

  if (!isReady) {
    qbLog.install('Database');

    await install(db);

    qbLog.install('Done');
  }

  qbLog.install('Update database');

  await update(db, migrations);

  qbLog.install('Done');

  structure(db);

  return db;
}

module.exports = setupDb;
