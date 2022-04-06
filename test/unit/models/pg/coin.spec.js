const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const Models = require(path.join(srcDir, '/models/pg'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Model:coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.coin = await Models.Coin.findByPk('26a05507-0395-447a-bbbb-000000000000');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('Should create', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash',
      code: 'BCH',
      price: '23456',
    });

    expect(coin.name).to.eq('Bitcoin Cash');
    expect(coin.code).to.eq('BCH');
    expect(coin.price).to.eq('23456');
  });

  it('Should find by coinCode', async () => {
    const coinCode = this.coin.code;
    const coin = await Models.Coin.findByCoinCode(coinCode);

    expect(coin.id).to.eq(this.coin.id);
  });
  it('Should update coin by Id', async () => {
    const coinId = this.coin.id;
    const price = '23568';
    const updatedAt = new Date();
    const coin = await Models.Coin.updateCoinData(coinId, price, updatedAt);
    expect(coin.name).to.eq(this.coin.name);
    expect(coin.code).to.eq(this.coin.code);
    expect(coin.price).to.eq('23568');
  });
  it('Should filterKeys', async () => {
    const coin = await Models.Coin.create({
      name: 'Amon',
      code: 'AMN',
      price: '25963',
    });

    const filterCoin = coin.filterKeys();
    expect(Object.keys(filterCoin).length).to.eq(4);
  });
});
