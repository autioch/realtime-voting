const { info, warn, error } = require('qb-log');
const { writeFile, readFile } = require('./utils');

module.exports = class Choices {
  constructor() {
    this.choices = {};
    this.id = 'choices';
  }

  set(key, value) {
    this.choices[key] = value;
  }

  readFromFile() {
    return readFile(this.id)
      .then((lines) => {
        this.choices = JSON.parse(lines || '{}');

        info(`Found ${Object.keys(this.choices).length} ${this.id}.`);

        return this;
      })
      .catch(() => {
        warn(`Failed to read ${this.id} from file.`);

        return this;
      });
  }

  writeToFile() {
    return writeFile(this.id, this.choices)
      .then(() => info(`Saved ${Object.keys(this.choices).length} ${this.id}.`))
      .catch((err) => error(`Failed to save ${this.choices.length} ${this.id}.\n${err.message}`));
  }

  serializeToFrontend() {
    return Object.assign({}, this.choices);
  }
};
