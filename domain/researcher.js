const request = require('request');
const apiConfig = require('../config/api.json');
const _ = require('lodash');
const logger = require('log4js').getLogger('Researcher');

class Researcher {
  constructor() {
    this.config = {};
    this.config.user = process.env.kole_user;
    this.config.apiKey = process.env.kole_api_key;

    this.requests = {};
    this.requests.links = {
      url: _.template(apiConfig.requests.links.urlTemplate)(this.config),
      headers: apiConfig.requests.links.headers,
    };

    this.sync();
  }

  sync() {
    return request.get(this.requests.links, (err, response, body) => {
      const bodyObj = JSON.parse(body);
      logger.debug(`Received: ${body}`);
      logger.info(response.headers);
      bodyObj.links.forEach((value, index, array) => {
        this.requests[value.method] = {};
        this.requests[value.method].url = value.url;
        this.requests[value.method].headers = {
          Accept: value.media_type,
        };
        this.requests[value.method].auth = {
          user: process.env.kole_user,
          pass: process.env.kole_api_key,
        };
      });

      logger.debug(this.requests);
      request(this.requests.listProducts, (err, response, pBody) => {
        logger.debug(`Products?: ${pBody}`);
      });
    })
      .on('error', (err) => {
        throw err;
      })
      .on('response', (response) => {
        logger.info(`Sync Status Code: ${response.statusCode}`);
      });
  }
}

module.exports = Researcher;
