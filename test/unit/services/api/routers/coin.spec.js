const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const config = require(path.join(srcDir, '../config'));

describe('Router: coin', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.get = sandbox.stub(Router.prototype, 'get');
    this.put = sandbox.stub(Router.prototype, 'put');
  });

  afterEach(() => {
    config.DEMO_ACCOUNT = null;
    sandbox && sandbox.restore();
  });

  it('Should get router', async () => {
    const router = await CoinRouter.router();
    expect(router instanceof Router).to.be.true;
    expect(router.get.calledWith('/:coinCode', CoinRouter.getCoinByCode)).to.be.true;
    expect(router.put.calledWith('/createCoin', CoinRouter.addCoinData)).to.be.true;
  });

  it('Should get coin', async () => {
    const ctx = {
      params: { coinCode: 'BTC' },
    };

    const coinData = {
      code: 'BTC',
      name: 'Bitcoin',
      price: '25698',
    };
    sandbox.stub(CoinController, 'getCoinByCode').resolves(coinData);
    await CoinRouter.getCoinByCode(ctx);
    expect(ctx.body).to.eq(coinData);
    expect(CoinController.getCoinByCode.calledOnce).to.be.true;
  });

  it('Should add coin data', async () => {
    const ctx = {
      request: {
        body: {
          coinCode: 'BTC',
          name: 'Bitcoin',
          price: '25698',
        },
      },
    };
    const coinData = {
      code: 'BTC',
      name: 'Bitcoin',
      price: '25698',
    };

    sandbox.stub(CoinController, 'addCoinData').resolves(coinData);
    await CoinRouter.addCoinData(ctx);
    expect(ctx.body).to.eq(coinData);
    expect(CoinController.addCoinData.calledOnce).to.be.true;
  });
});
