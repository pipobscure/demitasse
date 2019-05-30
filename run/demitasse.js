#!/usr/bin/env node

const Path = require('path');
const Fs = require('fs');

const { Program } = require('@pipobscure/options');
const { relative } = require('path');
const { describe, it, skip, todo, before, beforeEach, afterEach, after, report } = require(findModule(
  '@pipobscure/demitasse'
) || '@pipobscure/demitasse');
const globSync = require('glob').sync;

const NULLREPORT = {
  notifyInit: () => {},
  notifyStart: () => {},
  notifyFinish: () => {},
  notifyComplete: () => {},
  notifyError: (...args) => console.error(...args)
};

const program = new Program(undefined, async (opts, args) => {
  if (opts.global) {
    global.describe = describe;
    global.it = it;
    global.skip = skip;
    global.todo = todo;
    global.before = before;
    global.beforeEach = beforeEach;
    global.afterEach = afterEach;
    global.after = after;
    global.assert = require('assert');
  }
  if (opts.immute) {
    try {
      deepFreeze(global);
    } catch (err) {
      console.log(err.stack);
    }
  }

  const files = [].concat(...args.map((name) => globSync(name, { nodir: true, absolute: true })));
  if (!files.length) {
    console.error(`no tests for: ${args.join(', ')}`);
    return;
  }
  for (const file of files) {
    if (files.length > 1 && opts.describe) {
      describe(relative(process.cwd(), file), () => {
        require(file);
      });
    } else {
      require(file);
    }
  }
  const failures = await report(opts.style, opts);
  process.exit(failures);
});
program.main.flag('describe', 'd', 'describe separate files', false);
program.main.flag('global', 'g', 'put functions into global', false);
program.main.flag('flat', 'f', 'flat test-structure', false);
program.main.flag('immute', 'i', 'immutable global', false);
program.main.option('style', 'oputput style [tap | pretty | json | <module>]', undefined, loadStyle);
program.run(process.argv);

function loadStyle(opt) {
  if (!opt.value) {
    opt.default(NULLREPORT);
    return !!opt.value;
  }
  let style = !!~['tap', 'pretty', 'json'].indexOf(opt.value) ? `@pipobscure/demitasse-${opt.value}` : opt.value;
  const src = findModule(style);
  if (src) {
    opt.default(require(src).reporter);
  } else {
    try {
      opt.default(require(style).reporter);
    } catch (err) {
      console.error(`could not find style: ${style}`);
      opt.default(null);
    }
  }
  return !!opt.value;
}
function deepFreeze(o, seen = new Set(), path = []) {
  if (!~['object', 'function'].indexOf(typeof o) || !o) return o;
  if (seen.has(o)) return o;
  seen.add(o);
  const name = path.join('.');
  if (!!~['console', 'process'].indexOf(name)) {
    return Object.preventExtensions(o);
  }
  for (let prop of Object.getOwnPropertyNames(o)) {
    const desc = Object.getOwnPropertyDescriptor(o, prop);
    if ('value' in desc && !Object.isFrozen(desc.value)) {
      path.push(prop);
      deepFreeze(desc.value, seen, path);
      path.pop();
    }
  }
  try {
    return Object.freeze(o);
  } catch (err) {
    return o;
  }
}

function findModule(name) {
  name = name.split('/').join(Path.sep);
  const path = process.cwd().split(Path.sep);
  const opts =
    name[0] === '.'
      ? []
      : path.map((_, idx, all) => idx && [...all.slice(0, idx), 'node_modules'].join(Path.sep)).filter((x) => !!x);
  opts.push(path.join(Path.sep));
  opts.reverse();
  while (opts.length) {
    try {
      const src = Path.resolve(opts.shift(), name);
      Fs.accessSync(src);
      return src;
    } catch (err) {}
  }
}
