// const { describe, skip, it } = require('../index.js');
const { equal } = require('assert');
const FAIL = !!process.env.FAIL;

describe('basic', () => {
  new Array(10).fill(0).forEach((_, idx) => {
    const test = it(`should be ${idx}`, () => {
      if (FAIL && idx === 7) throw new Error('hallo');
      equal(idx, idx === 4 ? 1 : idx);
    });
    if (~[4].indexOf(idx)) test.skip('meant to skip');
    if (~[7].indexOf(idx)) test.todo('meant to todo');
  });
});

describe('basic too', () => {
  it('is a test', () => {});
});
