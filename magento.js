const logger = require('log4js').getLogger('Magento Client');
const Swagger = require('swagger-client');
const MagentoSwagger = require('./magento-client').Magento;
const Archivist = require('./domain/archivist');
const koleArchivist = new Archivist();


const magento = new MagentoSwagger({
  domain: 'http://theinternetgangster.com/drop-store/rest',
  token: {
    value: '39p6ygpesohqhj6quw0v9h9o1w2ly3q1',
  },
});

koleArchivist.getProducts({
  where: {
    category_id: 20,
  },
}).then((products) => {
  const product = products[0].get();
  product.product = product.title;
  magento.catalogProductRepositoryV1SavePut({
    sku: product.sku,
    $body: product,
  })
    .then(response => {
      logger.info(response.body);
    }, err => {
      logger.error(err.message);
    });
});
