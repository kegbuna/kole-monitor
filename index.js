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
  return koleResearcher.useLink('listProducts').then((result) => {
    const products = extractProducts(result);

    koleArchivist.saveCollection('Product', products).then((saveResult) => {
      if (result.products.links && result.products.links[0].method === 'listNextProducts') {
        koleResearcher.createLink(result.products.links[0]);
        return getNextProducts();
      }
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

function getNextProducts(previousCall) {
  logger.debug('Retrieving more products.');
  return koleResearcher.useLink('listNextProducts').then((nextResult) => {
    const moreProducts = extractProducts(nextResult);
    koleArchivist.saveCollection('Product', moreProducts).then(() => {

    });
  });
}

// main
Promise.all([koleArchivist.init(), koleResearcher.init()]).then(() => {
  logger.info('Everyone is ready. Starting up operations.');
  researchProducts();
});
