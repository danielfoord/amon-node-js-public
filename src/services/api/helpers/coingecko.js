const axios = require('axios');
const errors = require('../../../helpers/errors');

module.exports = {
  async getCoinPrice(coinName) {
    const coingeckoCodeId = coinName.toLowerCase();
    try {
      const fetchedData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coingeckoCodeId}`);

      return fetchedData.data.market_data.current_price.usd.toString();
    } catch (e) {
      errors.throwExposable('unknown_error', null, null, null);
    }
  },
};
