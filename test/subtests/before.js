import { describe, it, before } from '../../index.js';
import assert from 'assert';

describe('test', ()=>{
    before(()=>assert(false));
    it('test', ()=>assert(true));
});
