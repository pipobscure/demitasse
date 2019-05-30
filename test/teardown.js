describe('after', () => {
  let hasrun = false;
  it('has been run', () => {
    hasrun = true;
  });
  after(() => {
    assert(hasrun);
    return Promise.resolve();
  });
});
describe('afterEach', () => {
  let cnt = 1;
  afterEach(() => {
    cnt++;
  });
  it('test 1', () => {
    assert.equal(cnt, 1);
  });
  it('test 2', () => {
    assert.equal(cnt, 2);
  });
  it('test 3', () => {
    assert.equal(cnt, 3);
  });
  it('test 4', () => {
    assert.equal(cnt, 4);
  });
  it('test 5', () => {
    assert.equal(cnt, 5);
  });
  it('test 6', () => {
    assert.equal(cnt, 6);
  });
});
