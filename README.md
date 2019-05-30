# DemiTasse - Simple BDD Test Framework

Simple and small test-framework for node stuff that's basically half of [Mocha](http://mochajs.org). The half it doesn't support is configurability and coverage, since those are easy to add with separate tools.

**Large dependencies are a problem. Use them sparingly but whenever useful. When creating them, keep them light.**

## Install

```bash
npm install --save-dev @pipobscure/demitasse
```

To use TAP output:

```bash
npm install --save-dev @pipobscure/demitasse-tap
```

or alternatively for Pretty output

```bash
npm install --save-dev @pipobscure/demitasse-pretty
```

## Usage

_basic-test.js_

```javascript
import { define, it, before, beforeEach, afterEach, after } from '@pipobscure/bdd';
describe('suite 1', () => {
  it('assertion 1', () => {
    // assert something
  });
  it('assertion 2', () => {
    // assert something
  });
});
describe('suite 2', () => {
  it('assertion 1', () => {
    // assert something
  });
  it('assertion 2', () => {
    // assert something
  });
});
```

```bash
npx -p @pipobscure/demitasse-run demitasse basic-test.js
```

`demitasse` has a few options:

> demitasse [options][arguments]
> --describe / -d : describe separate files
> --global / -g : put functions into global
> --flat / -f : flatten the test structure
> --style=<value> : oputput style [tap | pretty | <module>](default: 'tap')

The `--describe` option wraps each file in a separate describe increasing the level of the test tree in case there are multiple test-files to be run.

The `--global` option puts `describe`, `it`, `before`, `beforeEach`, `afterEach`, `after` into the global object, so that test-drivers don't need to require them.

The `--style=` option allows for a choice in output. These need to be installed separately.

## Motivation

I really like BDD style testing and TAP output. However mocha and its ilk, always bring in everything and the kitchen sink. I don't want to download gigabytes of packages just to have some basic tests; instead I'd rather my test-framework is small and does just what it's core job is.

If I want more (coverage) there are tools for that. Just run the tests with `c8` (or instanbul) and be merry. There is no reason that a test framework needs to be heavy weight.

There is also a [more detailed rationale](./RATIONALE.md) for why it's a good idea to create "yet another test-framework".

## API

All API functions are bound so they can be assigned to scope variables to imitate the global behaviour that Mocha provides.

### describe(name : string, setup : function)

Defines a test. The setup function may contain calls to any of the other API functions. It is however a synchronous function, so you need to use the `before()`, `beforeEach()`, `afterEach()` and `after()` function to do any asynchronous setup.

### describe.skip(name : string, setup : function)

Defines a test just like `describe` except when the tests are actually run these will be skipped.

### describe.only(name : string, setup : function)

Defines a test just like `describe` except when the tests are actually run only those defined via `.only` will actually be executed. However this filtering is per test-suite. So children of tests that are run or other parents are not affected.

### describe.todo(name : string, setup : function)

Defines a test just like `describe` except when the tests are actually run these will be skipped.

### it(name : string, test : function)

Defines an assertion. This function can return a promise which will be awaited before the next assertion is made.

Calling `it()` is illegal outside the synchronous `describe()` setup function.

### it.skip(name : string, test : function)

Defines an assertion just like `it` except that it will be skipped when running the tests.

### it.only(name : string, test : function)

Defines an assertion just like `it` except that when the assertions are actually made only those defined with only (of this suite) will be run.

### it.todo(name : string, test : function)

Defines an assertion just like `it` and marks it as **to do** indicating that a failure is not a regression, but rather unimplemented.

### timeout(name : string, ms: number, test : function)

Defines an assertion that will time out after `ms` milliseconds. This is similar to `it()`, except the test times out after `ms` milli-seconds.

Calling `timeout()` is illegal outside the synchronous `describe()` setup function.

### Setup/Teardown Functions

DemiTasse provides the following Setup/Teardown functions.

- `before(setup : function)`
- `beforeEach(setup : function)`
- `afterEach(setup : function)`
- `after(setup : function)`

The passed runner function may return a then-able to perform asynchronous setup/teardown.
If the returned then-able rejects, the entire test-case fails.

Calling these setup/teardown functions is illegal outside the synchronous `describe()` setup function.

## License

Copyright 2019 Philipp Dunkel, Bloomberg LP

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
