// deps
const request = require('request');
const _ = require('lodash');
const logger = require('log4js').getLogger('Researcher');
const Promise = require('bluebird');

// configs
const apiConfig = require('../config/api.json');

class Researcher {
  constructor() {
    this.config = {};
    this.config.user = apiConfig.user || process.env.kole_user;
    this.config.apiKey = apiConfig.pass || process.env.kole_api_key;

    this.requests = {};
    this.requests.links = {
      url: _.template(apiConfig.requests.links.urlTemplate)(this.config),
      headers: apiConfig.requests.links.headers,
    };
  }

  init() {
    return new Promise((resolve, reject) => {
      request.get(this.requests.links, (err, response, body) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          logger.fatal(`Failed to initialize: Code: ${response.statusCode}. Message: ${response.statusMessage}.`);
          reject('Bad Response code received.');
        } else {
          const bodyObj = JSON.parse(body);
          this.createLinks(bodyObj.links);
          logger.info('Researcher ready.');
          resolve();
        }
      })
        .on('error', (err) => {
          logger.fatal(`Client error: ${err}`);
          reject('Client error.');
        });
    });
  }

  createLinks(links) {
    links.forEach((value) => {
      this.requests[value.method] = {};
      this.requests[value.method].url = value.url;
      this.requests[value.method].headers = {
        Accept: value.media_type,
      };
      this.requests[value.method].auth = {
        user: this.config.user,
        pass: this.config.apiKey,
      };
    });

    logger.debug(`Links created: ${Object.keys(this.requests).join(',')}`);
  }
}

module.exports = Researcher;
