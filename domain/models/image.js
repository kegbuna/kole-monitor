/**
 * The Product Image model
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model|void}
 * @constructor
 */
function Image(sequelize, DataTypes) {
  const Model = sequelize.define('Image', {
    size: DataTypes.STRING,
    url: DataTypes.STRING,
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

module.exports = Image;
