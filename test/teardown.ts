import assert from 'assert';
import { describe, it, after, afterEach } from '../';
import { exec } from './utils/exec.js';
import { resolve } from 'path';

describe('teardown', () => {
  let complete = false;
  let count = 0;
  describe('teardown', () => {
    after(() => {
      complete = true;
    });
    afterEach(() => {
      count += 1;
    });
    it('run', () => assert.equal(count, 0));
    it('run', () => assert.equal(count, 1));
    it('run', () => assert.equal(count, 2));
    it('run', () => assert.equal(count, 3));
  });
  it('done', () => assert(complete));
  it('count', () => assert.equal(count, 4));

  it('fail after', async () => assert.equal(await exec(resolve(__dirname, 'subtests/after.js')), 3));
  it('fail aftereach', async () => assert.equal(await exec(resolve(__dirname, 'subtests/aftereach.js')), 3));
});
