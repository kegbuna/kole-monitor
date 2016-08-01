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
      this.createLink(value);
    });
    logger.debug(`Links created: ${Object.keys(this.requests).join(',')}`);
  }

  createLink(link) {
    this.requests[link.method] = {};
    // have to manually replace &amp;, lame
    this.requests[link.method].url = decodeURIComponent(link.url).replace(/&amp;/g, '&');

    this.requests[link.method].headers = {
      Accept: link.media_type,
    };
    this.requests[link.method].auth = {
      user: this.config.user,
      pass: this.config.apiKey,
    };
  }

  useLink(linkName) {
    return new Promise((resolve, reject) => {
      logger.debug(`Attempting to use: ${JSON.stringify(this.requests[linkName])}`);
      request.get(this.requests[linkName], (err, response, body) => {
        if (err) {
          throw err;
        }
        if (response.statusCode !== 200) {
          logger.error('Bad response received.');
          reject();
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }
}

module.exports = Researcher;
