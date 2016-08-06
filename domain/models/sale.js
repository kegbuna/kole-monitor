/**
 * The Product Sale model.
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model|void}
 * @constructor
 */
function Sale(sequelize, DataTypes) {
  const Model = sequelize.define('Sale', {
    on_sale: DataTypes.INTEGER,
    sale_name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    upc: {
      type: DataTypes.BIGINT,
    },
  }, {
    classMethods: {
      associate: models => Model.belongsTo(models.Product),
    },
  });

  return Model;
}

module.exports = Sale;
