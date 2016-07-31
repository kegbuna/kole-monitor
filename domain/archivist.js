const logger = require('log4js').getLogger('Archivist');
const models = require('./models');
const Sequelize = require('sequelize');

/**
 * The DB Abstraction class
 */
class Archivist {
  constructor(config) {
    models.sequelize.sync().then(() => {
      logger.debug('Models synced. We\'re ready to go.');
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
