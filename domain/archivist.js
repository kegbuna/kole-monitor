const logger = require('log4js').getLogger('Archivist');
const models = require('./models');
const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();
const Promise = require('bluebird');

/**
 * The DB Abstraction class
 */
class Archivist {
  constructor() {
    this.models = models;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.models.sequelize.sync().then(() => {
        logger.info('Models synced. We\'re ready to go.');
        resolve();
      }, (err) => {
        logger.fatal(`Something went wrong. Unable to sync with db: ${err.name}, message: ${err.message}`);
        reject();
      });
    });
  }

  getRecords(query) {

  }

  /**
   * Saves a result set from the api
   * @param {string} modelName
   * @param {object} collection The results
   */
  saveCollection(modelName, collection) {
    logger.info(`Attempting to save ${modelName}`);
    return this.models[modelName].bulkCreate(collection).then((instance) => {
      logger.info('Successfully saved collection.');
    });
  }
}

module.exports = Archivist;
