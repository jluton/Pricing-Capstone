const { expect, should } = require('chai');
const activeQuote = require('./../global_variables/activeQuote');
const cars = require('./../global_variables/cars');

describe('Quote generator', () => {
  const previousQuote = {
    surgeInEffect: activeQuote.surgeInEffect,
    quotedSurgedRatio: activeQuote.quotedSurgedRatio,
    crossedThreshold: activeQuote.crossedThreshold,
  };

  before(async () => {
    activeQuote.surgeInEffect = false;
    activeQuote.quotedSurgedRatio = 1;
    activeQuote.crossedThreshold = false;

    cars.availableDrivers = 0;
    cars.totalActiveDrivers = 1000;

    await new Promise((resolve) => {
      setTimeout(() => {resolve()}, 1800);
    })
  })
  after(() => {
    activeQuote.surgeInEffect = previousQuote.surgeInEffect;
    activeQuote.quotedSurgedRatio = previousQuote.quotedSurgedRatio;
    activeQuote.crossedThreshold = previousQuote.crossedThreshold;
  });
  // TODO: Use sinon spy to make sure that quote generator is called multiple times.
  // Once you know how to do that, do the same thing for archiver.
  it('should be called');
  // TODO: It doesn't seem like the quote generator is changing the global variable.
  it('should change the activeQuote surge ratio', () => {
    expect(activeQuote.surgeInEffect).to.equal(true);
    expect(activeQuote.quotedSurgedRatio).to.be.greaterThan(1);
  });
  it('should determine whether a threshold was crossed', () => {
    expect(activeQuote.crossedThreshold).to.equal(true);
  });
  it('should send a notification if a threshold was crossed');
});