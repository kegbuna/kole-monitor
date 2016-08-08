/**
 * Price Tier model
 * @param {Sequelize} sequelize
 * @param {object} DataTypes
 * @constructor
 */
function Tier(sequelize, DataTypes) {
  const Model = sequelize.define('Tier', {
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    upc: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: models => Model.belongsTo(models.Product),
    },
  });
  return Model;
}

module.exports = Tier;
