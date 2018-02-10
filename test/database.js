const { expect, should } = require('chai');
const client = require('./../database/index');
const { storeQuoteEntry, updateAccepted, getCalculationById } = require('./../database/helpers');
const produceRandomData = require('./../data_generator/random_data');
const { regenerateRedis } = require('./../data_generator/cache');

const cleanDB = function () {
  return client.query(`DELETE FROM quotes WHERE calculation_id='TESTENTRY' OR calculation_id='TESTENTRY2'`)
};

describe('Database', () => {
  before(async () => {
    try {
      await cleanDB()
      await regenerateRedis(100, false);

      const queryString = `INSERT INTO quotes VALUES
      ('TESTENTRY2', '2018-02-09T23:33:17.000Z', 1.5, 1.35, 60, 3, 42, 1, null)`;
  
      client.query(queryString);
    } catch (err) {
      throw new Error(err);
    }
  });
  after(() => {
    cleanDB()
      .catch((err) => { throw new Error(err); })
  });
  it('should store an entry in the database', async () => {
    const request = produceRandomData();
    request.calculationId = 'TESTENTRY';
    request.accepted = null;

    try {
      await storeQuoteEntry(request);
      const response = await getCalculationById('TESTENTRY');
      const data = response.rows[0];

      expect(response.rows[0]).to.exist;
      expect(data.calculation_id).to.equal('TESTENTRY');
      expect(data).to.have.property('calculation_time');
      expect(data).to.have.property('instantaneous_price');
      expect(data.instantaneous_price).to.be.a('string');
      expect(data).to.have.property('quoted_price');
      expect(data.quoted_price).to.be.a('string');
      expect(data).to.have.property('total_users');
      expect(data.total_users).to.be.a('number');
      expect(data).to.have.property('waiting_users');
      expect(data.waiting_users).to.be.a('number');
      expect(data).to.have.property('accepted');
      expect(data.accepted).to.equal(null);
    } catch (err) {
      throw new Error(err);
    }
  });
  it('should have a valid timestamp', async () => {
    const response = await getCalculationById('TESTENTRY');
    expect(new Date(response.rows[0].calculation_time).getTime() > 0).to.equal(true);
  })
  it('should update an entry in the database', async () => {
    try {
      await updateAccepted('TESTENTRY2', false);
      const response = await getCalculationById('TESTENTRY2');
      const data = response.rows[0];
      expect(data.accepted).to.equal(false);
    } catch (err) {
      throw new Error(err);
    }
  });
});

