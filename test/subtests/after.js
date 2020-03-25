import { describe, it, after } from '../../index.js';
import assert from 'assert';

describe('test', () => {
    after(() => assert(false));
    it('test', () => assert(true));
});
