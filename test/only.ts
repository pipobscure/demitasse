import assert from 'assert';
import { describe, it, configure } from '../';
// configure({print: true});
describe('only', () => {
  describe('Only with it.only()', () => {
    it('should be skipped', () => assert(false));
    it.only('should not be skipped', () => assert(true));
    it('should be skipped', () => assert(false));
  });
  describe('Only with it().only()', () => {
    it('should be skipped', () => assert(false));
    it('should not be skipped', () => assert(true)).only();
    it('should be skipped', () => assert(false));
  });
  describe('Only with it.only() where already skipped', () => {
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
    it.only('should not be skipped', () => assert(true));
    describe.skip('skip', () => {
      it('should be skipped', () => assert(false));
    });
  });
  describe('Only with describe.only()', () => {
    describe('one', () => {
      it('not run', () => assert(false));
    });
    describe.only('two', () => {
      it('run', () => assert(true));
    });
    describe('three', () => {
      it('not run', () => assert(false));
    });
  });
  describe('Only with describe().only()', () => {
    describe('one', () => {
      it('not run', () => assert(false));
    });
    describe('two', () => {
      it('run', () => assert(true));
    }).only();
    describe('three', () => {
      it('not run', () => assert(false));
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
