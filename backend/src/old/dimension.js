const { info, warn, error } = require('qb-log');
const crypto = require('crypto');  //eslint-disable-line
const generateToken = () => crypto.randomBytes(32).toString('hex'); // eslint-disable-line no-magic-numbers
const { writeFile, readFile } = require('./utils');

let nextId = 1;

module.exports = class Dimension {
  constructor({ items = [], id }) {
    this.id = id;
    this.items = items;
  }

  login(credentials = {}) {
    const item = this.find(credentials);

    if (item) {
      item.token = generateToken();
      info('Found existing col');

      return item;
    }
    info('Failed to login, adding new user.');

    return this.add();
  }

  add() {
    const newItem = {
      id: nextId++, // eslint-disable-line no-plusplus
      label: 'Anonymous',
      token: generateToken()
    };

    this.items.push(newItem);

    return newItem;
  }

  serializeToFrontend() {
    return this.items.map(({ id, label }) => ({
      id,
      label
    }));
  }

  readFromFile() {
    return readFile(this.id)
      .then((lines) => {
        this.items = JSON.parse(lines || '[]');

        nextId = Math.max(...this.items.map((item) => item.id)) + 1;
        info(`Found ${this.items.length} ${this.id}.`);

        return this;
      })
      .catch(() => {
        warn(`Failed to read ${this.id} from file.`);

        return this;
      });
  }

  writeToFile() {
    return writeFile(this.id, this.items)
      .then(() => info(`Saved ${this.items.length} ${this.id}.`))
      .catch((err) => error(`Failed to save ${this.items.length} ${this.id}.\n${err.message}`));
  }

  verify({ id, token }) {
    const item = this.get(id);

    const isVerified = !!item && item.token === token;

    if (!isVerified) {
      warn('Failed to verify user');
    }

    return isVerified;
  }

  rename(itemId, label) {
    const item = this.get(itemId);

    if (item) {
      item.label = label;
    } else {
      warn('Could not find item to rename, ', itemId, label);
    }
  }

  exit(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  find({ id, token, label }) {
    const numberId = parseInt(id, 10);

    return this.items.find((item) => item.id === numberId && item.token === token && item.label === label);
  }

  get(itemId) {
    return this.items.find((item) => item.id === itemId);
  }
};
