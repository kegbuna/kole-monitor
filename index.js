// logging and junk
const logger = require('log4js').getLogger('Kole Runner');
logger.setLevel('DEBUG');

// Pull in the classes we need
const Archivist = require('./domain/archivist');
const Researcher = require('./domain/researcher');
const Promise = require('bluebird');

// Get some instances up
logger.debug('Initializing Archivist.');
const koleArchivist = new Archivist();

logger.debug('Initializing Researcher.');
const koleResearcher = new Researcher();

Promise.all([koleArchivist.init(), koleResearcher.init()]).then(() => {

});
