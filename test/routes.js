const { expect, should } = require('chai');
const supertest = require('supertest');

const app = require('./../server/index.js');
const api = supertest('http://localhost:3000');

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
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('number')
        expect(res.body).to.have.property('quotedSurgeRatio');
        expect(res.body.quotedSurgeRatio).to.be.a('number')
        expect(res.body).to.have.property('surgeInEffect');
        expect(res.body.surgeInEffect).to.be.a('boolean')
        expect(res.body).to.have.property('crossedThreshold');
        expect(res.body.crossedThreshold).to.be.a('boolean')
        done();
      });
  });
});

describe('POST accept/reject', () => {
  const requestBody = {
    quoteId: 738945,
    accepted: true,
  }

  it('should return 201', (done) => {
    api.post('/acceptReject')
      .send(requestBody)
      .expect(201, done);
  });
});

describe('POST cars', () => {
  const requestBody = {
    totalActiveDrivers: 40,
    availableDrivers: 3,
  }

  it('should return 201', (done) => {
    api.post('/cars')
      .send(requestBody)
      .expect(201, done);
  });
});

