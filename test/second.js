// const { describe, skip, it } = require('../index.js');
const { equal } = require('assert');
const FAIL = !!process.env.FAIL;

describe('second', () => {
  new Array(10).fill(0).forEach((_, idx) => {
    it(`should be ${idx}`, () => {
      if (FAIL && idx === 7) throw new Error('hallo');
      equal(idx, FAIL && idx === 4 ? 1 : idx);
    });
  });
});

describe('second too', () => {
  it('is a test', () => {
    if (FAIL) throw { a: 1, b: 'hallo', c: false, d: null, e: undefined };
  });
});
