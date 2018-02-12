const { expect, should } = require('chai');
const supertest = require('supertest');

const app = require('./../server/index.js');
const api = supertest('http://localhost:3000');

describe('Routes', () => {
  describe('GET pricing', () => {
    it('should respond with a 200 status', (done) => {
      api.get('/pricing')
        .query({
          totalActiveUsers: 30,
          waitingUsers: 4,
        })
        .expect(200, done);
    });
    it('should should with an object with quote information', (done) => {
      api.get('/pricing')
        .query({
          totalActiveUsers: 30,
          waitingUsers: 4,
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body } = res;
          expect(body).to.have.property('calculationId');
          expect(body.id).to.be.a('number')
          expect(body).to.have.property('quotedSurgeRatio');
          expect(body.quotedSurgeRatio).to.be.a('number')
          expect(body).to.have.property('surgeInEffect');
          expect(body.surgeInEffect).to.be.a('boolean')
          expect(body).to.have.property('crossedThreshold');
          expect(body.crossedThreshold).to.be.a('boolean')
          done();
        });
    });
  });
  
  describe('POST accept/reject', () => {
    it('should return 201', (done) => {
      const requestBody = {
        quoteId: 738945,
        accepted: true,
      };

      api.post('/acceptReject')
        .send(requestBody)
        .expect(201, done);
    });
  });
  describe('POST cars', () => {
    it('should return 201', (done) => {
      const requestBody = {
        totalActiveDrivers: 40,
        availableDrivers: 3,
      };

      api.post('/cars')
        .send(requestBody)
        .expect(201, done);
    });
  });
});



