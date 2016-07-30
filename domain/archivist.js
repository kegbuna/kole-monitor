const mysql = require('mysql');
const logger = require('log4js').getLogger('Archivist');

module.exports = class Archivist {
  constructor(config) {
    this.connection = mysql.createConnection({
      host: config.host,
      database: config.database,
      user: config.user,
      password: config.password,
    });
  }

  getRecords(query) {
    const queryString = query.string || '*';
    this.connection.query(`SELECT ${queryString} from ${query.table}`, (err, rows, fields) => {
      if (err) {
        throw err;
      }
      logger.debug(rows);
      logger.debug(fields);
    });

    this.connection.end();
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
};
