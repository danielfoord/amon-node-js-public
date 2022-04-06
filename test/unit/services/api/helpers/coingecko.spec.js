const sinon = require('sinon');
const axios = require('axios');

const assert = require('assert');

describe('Helpers: Coingecko', () => {
  it('return data', async () => {
    const coinCode = 'btc';
    const stub = sinon.stub(axios, 'get').callsFake(() => Promise.resolve({ status: 200 }));
    const test = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinCode}`);

    assert.deepEqual(test, { status: 200 });
    assert.strictEqual(stub.callCount, 1);
  });
});
