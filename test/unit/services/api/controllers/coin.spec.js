const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));
const moment = require('moment');

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'ETH';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(4);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });

    it('updated time of returned coin should be less than one hour', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);
      const updatedTime = moment(new Date()).diff(coin.priceUpdatedAt, 'hours');
      expect(updatedTime).to.be.lessThan(1);
    });
  });

  describe('addCoinData', () => {
    it('should add coin data and return added data', async () => {
      const coinData = {
        coinCode: 'AMN',
        name: 'Amon',
        price: '23455',
      };

      const coin = await CoinController.addCoinData(coinData);

      expect(coin.code).to.eq(coinData.coinCode);
      expect(coin.name).to.eq(coinData.name);
      expect(coin.price).to.eq(coinData.price);
      expect(Object.keys(coin).length).to.eq(4);
    });

    it('should fail add coin data', async () => {
      const coinData = {
        coinCode: 'ETH',
        name: 'ethereum',
      };
      expect(CoinController.addCoinData(coinData)).to.be.rejectedWith(Error, 'duplicated_coin_code');
    });
  });
});
