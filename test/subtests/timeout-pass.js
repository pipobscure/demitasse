import { describe, it } from '../../index.js';
import { sleep } from '../utils/sleep.js';

describe('timeout-pass', () => {
  it('timeout 1000', () => sleep(1000));
});
