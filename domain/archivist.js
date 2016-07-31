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
      }, () => {
        reject();
      });
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
