const logger = require('log4js').getLogger('Archivist');
const models = require('./models');
const Sequelize = require('sequelize');

/**
 * The DB Abstraction class
 */
class Archivist {
  constructor(config) {
    this.sequelize = new Sequelize(config.database, config.user, config.password, {
      host: config.host,
      dialect: 'mysql',
    });


  }

  getRecords(query) {
    this.sequelize.authenticate().then((err) => {
      logger.debug('All good.');
    })
      .catch((err) => {
        logger.fatal("Can't connect to db");
        logger.fatal(err);
      });
  }

  /**
   * Saves a result set from the api
   * @param {object} collection The results
   */
  saveCollection(collection) {
    const table = Object.keys(collection)[0];
    const keys = Object.keys(collection[table]);

    if (typeof collection !== 'object' || Object.keys(collection).length > 1) {
      throw new Error(`wth you doing?? what is this you' trying to save? look:${collection}`);
    }

    keys.forEach((value, index, array) => {
      this.connection.query(`INSERT INTO ${table}`, () => {
        logger.debug(arguments);
      });
    });
  }
}

module.exports = Archivist;
