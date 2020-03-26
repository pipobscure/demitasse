import { describe, it } from '../../index.js';
import { sleep } from '../utils/sleep.js';

describe('timeout-pass', () => {
  it('timeout 5000', () => sleep(5000));
});
