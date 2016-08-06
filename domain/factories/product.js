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

    if (Array.isArray(productJson)) {
      return productJson.map((value) => {
        return this.getProduct(value);
      });
    }

    return [this.getProduct(productJson)];
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

class ProductModel {
  constructor(data) {
    const fields = Object.keys(data);

    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      let fieldValue = data[field];

      if (typeof fieldValue !== 'object') {
        this[field] = fieldValue;
      }
    }

    this.associations = {
      images: [],
      links: [],
      tiers: [],
    };

    const assocTypes = Object.keys(this.associations);
    for (let i = 0; i < assocTypes.length; i++) {
      _.each(data[assocTypes[i]], (value) => {
        this.associations.images.push(new AssociationModel(data.upc, value));
      });
    }
    if (data.sale) {
      this.associations.sale = {};
      _.extend(this.associations.sale, data.sale);
    }
  }
}

class AssociationModel {
  constructor(upc, data) {
    this.upc = upc;
    _.extend(this, data);
  }
}