describe('before', () => {
  let prepared = false;
  before(() => {
    prepared = true;
    return Promise.resolve();
  });
  it('has been prepared', () => {
    assert(prepared);
  });
});
describe('beforeEach', () => {
  let cnt = 0;
  beforeEach(() => {
    cnt++;
  });
  it('test 1', () => {
    assert.equal(cnt, 1);
    return Promise.resolve();
  });
  it('test 2', () => {
    assert.equal(cnt, 2);
    return Promise.resolve();
  });
  it('test 3', () => {
    assert.equal(cnt, 3);
    return Promise.resolve();
  });
  it('test 4', () => {
    assert.equal(cnt, 4);
    return Promise.resolve();
  });
  it('test 5', () => {
    assert.equal(cnt, 5);
    return Promise.resolve();
  });
  it('test 6', () => {
    assert.equal(cnt, 6);
    return Promise.resolve();
  });
});
