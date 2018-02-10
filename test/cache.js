const { expect, should } = require('chai');
const redisClient = require('./../cache/index');

const { cachePriceQuote, getCachedInstantaneousPrices, getAllCachedQuotes } = require('./../cache/helpers');

describe('Cache', () => {
  after(() => {
    redisClient.flushdbAsync().catch((err) => { throw new Error(err); });
  });
  describe('Stores Price Quote', () => {
    it('Stores a quote in the redis cache', async () => {
      const dummyData = { 
        calculationId: 'TestID', 
        timestamp: '2018-02-09T23:33:17.000Z', 
        instantaneousPrice: 1.33 };
      const res = await cachePriceQuote(dummyData);
      expect(res).to.equal('OK');

      const hash = await redisClient.hgetallAsync('c:TestID');
      expect(hash).to.exist;
      expect(hash).to.have.property('timestamp');
      expect(new Date(hash.timestamp).getTime() > 0).to.equal(true);
      expect(hash).to.have.property('instantaneousPrice');
      expect(hash.instantaneousPrice).to.be.a('string');
    });
  });
  describe('Gets cached quotes', () => {
    it('Gets cached quote information', async () => {
      const quotes = await getAllCachedQuotes()
      expect(quotes).to.be.an('array');
      expect(quotes[0]).to.be.an('object');
      expect(quotes[0]).to.have.property('timestamp');
      expect(quotes[0]).to.have.property('instantaneousPrice');
    });
    it('Gets an array of instantaneously calculated prices', async () => {
      const prices = await getCachedInstantaneousPrices();
      expect(prices).to.be.an('array');
      expect(prices[0]).to.be.a('string');
    });
  });
});