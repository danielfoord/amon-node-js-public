const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),
  schemaAddCoinData: Joi.object({
    name: Joi.string().min(3),
    coinCode: Joi.string().uppercase().max(3),
    price: Joi.string(),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },
  async addCoinData(ctx) {
    const params = {
      coinCode: ctx.request.body.coinCode,
      name: ctx.request.body.name,
      price: ctx.request.body.price,
    };

    const formattedParams = await validateParams(CoinRouter.schemaAddCoinData, params);

    ctx.body = await CoinController.addCoinData(formattedParams);
  },
  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Status
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);
    router.put('/createCoin', CoinRouter.addCoinData);

    return router;
  },
};

module.exports = CoinRouter;
