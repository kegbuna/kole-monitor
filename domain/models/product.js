/**
 * The Product model
 * @param {Sequelize} sequelize A sequelize instance
 * @param {object} DataTypes Set of Sequelize data types
 * @returns {*|{}|Model|void} A sequelize model
 * @constructor
 */
function Product(sequelize, DataTypes) {
  const Model = sequelize.define('Product', {
    sku: DataTypes.STRING,
    upc: DataTypes.BIGINT,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    brand: DataTypes.STRING,
    colors: DataTypes.STRING,
    materials: DataTypes.STRING,
    attribute_list: {
      type: DataTypes.STRING,
      field: 'attributes',
    },
    tags: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    category: DataTypes.STRING,
    subcategory_id: DataTypes.INTEGER,
    subcategory: DataTypes.STRING,
    inventory: DataTypes.INTEGER,
    is_closeout: DataTypes.INTEGER,
    unit_weight: DataTypes.DECIMAL,
    created: DataTypes.DATE,
    modified: DataTypes.DATE,
  }, {
    classMethods: {
      associate: models => {
        Model.hasMany(models.Image);
        Model.hasMany(models.Tier);
        Model.hasMany(models.Link);
        Model.hasOne(models.Sale);
      },
    },
  });
  return Model;
}

module.exports = Product;
