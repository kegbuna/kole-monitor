const logger = require('log4js').getLogger('Product Factory');
const _ = require('lodash');

class ProductFactory {
  /**
   * Returns an array of products.
   * @param {array|object} productJson Either a collection or single product json
   * @returns {ProductModel[]}
   */
  static getProducts(productJson) {
    if (typeof productJson !== 'object') {
      throw new Error('Argument type is wrong.');
    }

    const products = {
      table: 'Products',
      data: [],
    };

    if (Array.isArray(productJson) || productJson.hasOwnProperty(0)) {
      _.each(productJson, (value, index) => {
        if (!isNaN(index)) {
          products.data.push(this.getProduct(value));
        }
      });
    } else {
      products.data.push(this.getProduct(productJson));
    }
    logger.debug(`New product array created with ${products.length} products.`);
    return products;
  }

  /**
   * Constructs a new product using the provided json
   * @param {object} productJson The product data to be turned into a model
   * @returns {ProductModel}
   */
  static getProduct(productJson) {
    return new ProductModel(productJson);
  }
}
/**
 *
 */
class ProductModel {
  constructor(data) {
    const fields = Object.keys(data);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldValue = data[field];

      if (typeof fieldValue !== 'object') {
        this[field] = fieldValue;
      }
    }

    this.associations = {
      images: {
        table: 'Images',
        data: [],
      },
      links: {
        table: 'Links',
        data: [],
      },
      tiers: {
        table: 'Tiers',
        data: [],
      },
    };

    const assocTypes = Object.keys(this.associations);
    for (let i = 0; i < assocTypes.length; i++) {
      const assocType = assocTypes[i];
      _.each(data[assocType], (value) => {
        this.associations[assocType].data.push(new AssociationModel(data.upc, value));
      });
    }
    if (data.sale) {
      this.associations.sale = {
        table: 'Sale',
        data: {
          upc: data.upc,
        },
      };
      _.extend(this.associations.sale.data, data.sale);
    }
  }
}

class AssociationModel {
  constructor(upc, data) {
    this.upc = upc;
    _.extend(this, data);
  }
}

module.exports = ProductFactory;