const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const moment = require('moment');
const { getDateDifference } = require('../../../helpers/utils');
const { getCoinPrice } = require('../helpers/coingecko');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    if (getDateDifference(coin.priceUpdatedAt) >= 1) {
      const newCoinPrice = await getCoinPrice(coin.name);

      const updatedCoin = await Models.Coin.updateCoinData(coin.id, newCoinPrice, moment());
      return updatedCoin.filterKeys(['name', 'price', 'code']);
    } else {
      return coin.filterKeys(['name', 'price', 'code']);
    }
  },
  async addCoinData(coinData) {
    const existingCoin = await Models.Coin.findByCoinCode(coinData.coinCode);
    if (existingCoin) {
      errors.throwExposable('duplicated_coin_code', null, null, null);
    } else {
      const coin = await Models.Coin.createCoinData(coinData.coinCode, coinData.name, coinData.price);

      return coin.filterKeys(['name', 'price', 'code']);
    }
  },
};

module.exports = CoinController;
