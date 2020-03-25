import { describe, it, before, beforeEach } from '../index.js';
import assert from 'assert';
import { exec } from './utils/exec.js';

describe('setup', () => {
    let prepped = false;
    let count = 0;
    before(()=>{
        prepped = true;
    });
    beforeEach(()=>{
        count += 1;
    });
    it('run', ()=>{
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
    it('fail before', async () => assert.equal(await exec('test/subtests/before.js'), 3));
    it('fail beforeEach', async () => assert.equal(await exec('test/subtests/beforeeach.js'), 3));
});
