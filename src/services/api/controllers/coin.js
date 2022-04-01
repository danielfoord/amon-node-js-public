const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const axios = require('axios');
const { getDateDifference } = require('../../../helpers/utils');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');
    const coingeckoCodeId = coin.name.toLowerCase();

    if (getDateDifference(coin.updatedAt) >= 1) {
      const fetchedData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coingeckoCodeId}`);
      const newPrice = fetchedData.data.market_data.current_price.usd.toString();
      const updatedCoin = await Models.Coin.updateCoinData(coin.id, newPrice, fetchedData.data.last_updated);
      return updatedCoin.filterKeys();
    }

    return coin.filterKeys();
  },
  async addCoinData(coinData) {
    const existingCoin = await Models.Coin.findByCoinCode(coinData.coinCode);
    if (existingCoin) {
      errors.throwExposable('duplicated_coin_code', null, null, null);
    }

    const coin = await Models.Coin.createCoinData(coinData.coinCode, coinData.name, coinData.price);

    return coin.filterKeys();
  },
};

module.exports = CoinController;
