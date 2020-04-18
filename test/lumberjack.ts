'use strict';

import { configure, beforeEach, describe, it, main } from '../';
import assert from 'assert';

configure({ autorun: false });

describe('Application', () => {
  let application = 0;
  beforeEach(() => {
    application += 1;
  });
  describe('#name', () => {
    it("returns the application's bundle name", () => {
      assert.equal(application, 1);
    });
  });
  describe('#version', () => {
    it("returns the application's bundle version", () => {
      assert.equal(application, 2);
    });
  });
  describe('#entryPoint', () => {
    it("returns the application's entry point", () => {
      assert.equal(application, 3);
    });
  });
  describe('#bundleInformation', () => {
    it('includes the bundle name and version', () => {
      assert.equal(application, 4);
    });
  });
  describe('#verboseBundleInformation', () => {
    it('includes the bundle name, version, entry point, and type', () => {
      assert.equal(application, 5);
    });
  });
});

main();
