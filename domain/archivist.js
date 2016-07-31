const logger = require('log4js').getLogger('Archivist');
const models = require('./models');
const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();
/**
 * The DB Abstraction class
 */
class Archivist {
  constructor() {
    models.sequelize.sync().then(() => {
      logger.info('Models synced. We\'re ready to go.');
      eventEmitter.emit('ready', this);
    });
  }

  getRecords(query) {

  }

  /**
   * Saves a result set from the api
   * @param {object} collection The results
   */
  saveCollection(collection) {

  }
}

module.exports = Archivist;
