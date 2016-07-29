const apiConfig = require('./config/api.json');
const logger = require('log4js').getLogger('Kole Runner');
logger.setLevel('DEBUG');

const request = require('request');
const _ = require('lodash');

const config = {
  user: process.env.kole_user,
  apiKey: process.env.kole_api_key,
};

const koleUrl = _.template(apiConfig.entry)(config);

logger.debug(`Base URL is ${koleUrl}`);

request(koleUrl, null, (err, response, body) => {
  logger.debug(`Response returned: ${body}`);
});
