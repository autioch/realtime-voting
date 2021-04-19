/* eslint no-magic-numbers: 0 */
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const EVENTS = {
  ITEMS_ADD: 'items--add',
  ITEMS_UPDATE: 'items--update',
  ITEMS_REMOVE: 'items--remove',

  VOTERS_ADD: 'voters--add',
  VOTERS_UPDATE: 'voters--update',
  VOTERS_REMOVE: 'voters--remove',

  CHOICES_SET: 'choices--set',
  CHOICES_REMOVE: 'choices--remove'
};

module.exports = {
  EVENTS,
  HTTP_STATUS
};
