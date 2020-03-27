import assert from 'assert';
import { describe, it, before, beforeEach } from '../';
import { exec } from './utils/exec.js';
import { resolve } from 'path';

describe('setup', () => {
  let prepped = false;
  let count = 0;
  before(() => {
    prepped = true;
  });
  beforeEach(() => {
    count += 1;
  });
  it('run', () => {
    assert(prepped);
    assert.equal(count, 1);
  });
  it('run', () => {
    assert(prepped);
    assert.equal(count, 2);
  });
  it('run', () => {
    assert(prepped);
    assert.equal(count, 3);
  });
  it('fail before', async () => assert.equal(await exec(resolve(__dirname,'subtests/before.js')), 3));
  it('fail beforeEach', async () => assert.equal(await exec(resolve(__dirname, 'subtests/beforeeach.js')), 3));
});
