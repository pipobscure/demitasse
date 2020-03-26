import assert from 'assert';

describe('only', () => {
  describe('Only', () => {
    it('should be skipped', () => assert(false));
    it.only('should not be skipped', () => assert(true));
    it('should be skipped', () => assert(false));
  });
  describe('Only', () => {
    it('should be skipped', () => assert(false));
    it('should not be skipped', () => assert(true)).only();
    it('should be skipped', () => assert(false));
  });
  describe('Only', () => {
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
    it.only('should not be skipped', () => assert(true));
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
  });
  describe('Only', () => {
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
    it('should not be skipped', () => assert(true)).only();
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
  });
});
