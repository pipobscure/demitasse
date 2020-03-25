import { describe, it, after, afterEach } from '../index.js';
import assert from 'assert';
import { exec } from './utils/exec.js';

describe('teardown', () => {
    let complete = false;
    let count = 0;
    describe('teardown', ()=>{
        after(()=>{
            complete = true;
        });
        afterEach(()=>{
            count += 1;
        });
        it('run', ()=>assert.equal(count, 0));
        it('run', () => assert.equal(count, 1));
        it('run', () => assert.equal(count, 2));
        it('run', () => assert.equal(count, 3));
    });
    it('done', ()=>assert(complete));
    it('count', () => assert.equal(count, 4));

    it('fail after', async () => assert.equal(await exec('test/subtests/after.js'), 3));
    it('fail aftereach', async () => assert.equal(await exec('test/subtests/aftereach.js'), 3));
});
