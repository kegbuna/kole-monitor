const apiConfig = require('./config/api.json');
const dbConfig = require('./config/database.json');

// logging and junk
const logger = require('log4js').getLogger('Kole Runner');
logger.setLevel('DEBUG');

// yea boy lodash
const _ = require('lodash');

//
const config = {
  user: process.env.kole_user,
  apiKey: process.env.kole_api_key,
};

const koleUrl = _.template(apiConfig.entry)(config);

const Archivist = require('./domain/archivist');

dbConfig.user = process.env.kole_db_user;
dbConfig.password = process.env.kole_db_password;

const kole = new Archivist(dbConfig);

kole.getRecords();