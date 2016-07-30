const apiConfig = require('./config/api.json');
const dbConfig = require('../config/database.json');
const logger = require('log4js').getLogger('Kole Runner');
logger.setLevel('DEBUG');

const request = require('request');
const _ = require('lodash');

const config = {
  user: process.env.kole_user,
  apiKey: process.env.kole_api_key,
};

const koleUrl = _.template(apiConfig.entry)(config);

