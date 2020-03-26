import { exec } from './utils/exec.js';
import { equal } from 'assert';

describe('Timeout', () => {
  timeout('should fail for 5000ms', 10000, async () => equal(await exec('test/subtests/timeout-fail.js'), 1));
  timeout('should pass for 1000ms', 10000, async () => equal(await exec('test/subtests/timeout-pass.js'), 0));
  it.timeout('should fail for 5000ms', 10000, async () => equal(await exec('test/subtests/timeout-fail.js'), 1));
  it.timeout('should pass for 1000ms', 10000, async () => equal(await exec('test/subtests/timeout-pass.js'), 0));
});
