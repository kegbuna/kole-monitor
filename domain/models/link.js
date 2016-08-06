/**
 * The Product Link model
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model|void}
 * @constructor
 */
function Link(sequelize, DataTypes) {
  const Model = sequelize.define('Link', {
    upc: {
      type: DataTypes.BIGINT,
    },
    method: DataTypes.STRING,
    media_type: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    classMethods: {
      associate: models => Model.belongsTo(models.Product, { foreignKey: 'sku' }),
    },
  });
  return Model;
}

module.exports = Link;
