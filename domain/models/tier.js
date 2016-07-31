/**
 * Price Tier model
 * @param sequelize
 * @param DataTypes
 * @constructor
 */
function Tier(sequelize, DataTypes) {
  const Model = sequelize.define('Tier', {
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
  }, {
    classMethods: {
      associate: function(models) {
        Model.belongsTo(models.Product);
      },
    },
  });
  return Model;
}

module.exports = Tier;
