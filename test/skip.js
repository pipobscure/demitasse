import assert from 'assert';

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
