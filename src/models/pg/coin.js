const { v4: uuid } = require('uuid');
const { pick, now } = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const Coin = sequelize.define(
    'Coin',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priceUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: now(),
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function () {
    const obj = this.toObject();
    const filtered = pick(obj, 'price', 'name', 'code', 'priceUpdatedAt');

    return filtered;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };
  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };
  Coin.createCoinData = function (code, name, price) {
    return Coin.create({ code, name, price });
  };
  Coin.updateCoinData = async function (id, price, updatedAt) {
    const coin = await Coin.findByPk(id);
    coin.price = price;
    coin.priceUpdatedAt = updatedAt;
    coin.save();
    return Coin.findByPk(id);
  };

  return Coin;
};
