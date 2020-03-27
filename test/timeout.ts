import { exec } from './utils/exec.js';
import { resolve } from 'path';
import assert from 'assert';
import { describe, it, timeout } from '../';

describe('Timeout', () => {
  timeout('should fail for 5000ms', 10000, async () => assert.equal(await exec(resolve(__dirname, 'subtests/timeout-fail.js')), 1));
  timeout('should pass for 1000ms', 10000, async () => assert.equal(await exec(resolve(__dirname, 'subtests/timeout-pass.js')), 0));
  it.timeout('should fail for 5000ms', 10000, async () => assert.equal(await exec(resolve(__dirname, 'subtests/timeout-fail.js')), 1));
  it.timeout('should pass for 1000ms', 10000, async () => assert.equal(await exec(resolve(__dirname, 'subtests/timeout-pass.js')), 0));
});
