const { info, warn, error } = require('qb-log');
const { writeFile, readFile } = require('./utils');

function entriesToObject(entries) {
  return entries.reduce((dict, [key, value]) => {
    dict[key] = value;

    return dict;
  }, {});
}

module.exports = class Choices {
  constructor({ maxChoices = 1 }) {
    this.maxChoices = maxChoices;
    this.choices = {};
    this.id = 'choices';
  }

  set(key, value) {
    const entries = Object
      .entries(this.choices[key])
      .filter(([, val]) => !!val)
      .slice(0, this.maxChoices - 1);

    this.choices[key] = entriesToObject(entries);
    this.choices[key][value] = true;
  }

  login({ id }) {
    this.choices[id] = this.choices[id] || {};
  }

  exit({ id }) {
    const entries = Object.entries(this.choices).filter(([key]) => key !== id);

    this.choices = entriesToObject(entries);
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
