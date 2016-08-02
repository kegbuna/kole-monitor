// logging and junk
const logger = require('log4js').getLogger('Kole Runner');
logger.setLevel('DEBUG');

// Pull in the classes we need
const Archivist = require('./domain/archivist');
const Researcher = require('./domain/researcher');
const Promise = require('bluebird');
const _ = require('lodash');

// Get some instances up
logger.debug('Initializing Archivist.');
const koleArchivist = new Archivist();

logger.debug('Initializing Researcher.');
const koleResearcher = new Researcher();

// utility stuff
function researchProducts() {
  return new Promise((resolve, reject) => {
    koleResearcher.useLink('listProducts').then((result) => {
      const products = extractProducts(result);
      koleArchivist.saveCollection('Product', products);
      const linkIndex = hasMoreProducts(result);
      if (linkIndex > -1) {
        koleResearcher.createLink(result.products.links[linkIndex]);
        getNextProducts(resolve, reject);
      } else {
        resolve('We did it! We now have a bunch of products. Better reporting to come.');
      }
    }, (err) => {
      reject(err);
    });
  });
}

function extractProducts(result) {
  return _.reduce(result.products, (collection, value, key) => {
    let newValue = value;
    // weird bug with sequelize i can't have a model with attributes as an attribute
    newValue.attribute_list = value.attributes;

    if (!isNaN(key)) {
      collection.push(newValue);
    }
    return collection;
  }, []);
}

function getNextProducts(resolve, reject) {
  logger.debug('Retrieving more products.');
  koleResearcher.useLink('listNextProducts').then((result) => {
    const moreProducts = extractProducts(result);
    koleArchivist.saveCollection('Product', moreProducts)
      .then(() => {
        logger.info('Saved Next Products.');
      }, (err) => {
        logger.error(`Aw what the hell ${err}`);
      });
    const linkIndex = hasMoreProducts(result);
    if (linkIndex > -1) {
      koleResearcher.createLink(result.products.links[linkIndex]);
      getNextProducts(resolve, reject);
    } else {
      resolve();
    }
  }, (err) => {
    reject(err);
  });
}

function hasMoreProducts(result) {
  if (result.products.links) {
    return _.findIndex(result.products.links, {method: 'listNextProducts'});
  }
  return -1;
}

// main
Promise.all([koleArchivist.init(), koleResearcher.init()]).then(() => {
  logger.info('Everyone is ready. Starting up operations.');
  researchProducts().then((result) => {
    logger.info(`Research complete: ${result}`);
  }, (err) => {
    logger.error(`Damn: ${err}`);
  });
}, (err) => {
  logger.fatal('One or more classes failed to init. Check the logs. Quitting.');
  process.exit(1);
});
