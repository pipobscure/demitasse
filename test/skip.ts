import assert from 'assert';
import { describe, it } from '../';

describe('Skipping', () => {
  it.skip('should be skipped', () => assert(false));
  it('should be skipped', () => assert(false)).skip();
  describe.skip('skip', () => {
    it('should be skipped', () => assert(false));
  });
  describe('skip', () => {
    it('should be skipped', () => assert(false));
  }).skip();
});
