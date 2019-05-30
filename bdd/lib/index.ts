import { Harness, Definer } from './harness';
import { Handler } from './case';
import { Notifier } from './notifier';

const harness = new Harness();
export const describe = (name: string, define: Definer) => harness.describe(name, define);
export const before = (handler: Handler): void => harness.before(handler);
export const beforeEach = (handler: Handler): void => harness.beforeEach(handler);
export const afterEach = (handler: Handler): void => harness.afterEach(handler);
export const after = (handler: Handler): void => harness.after(handler);
export const it = (name: string, handler: Handler) => harness.it(name, handler);
export const todo = (name: string, handler: Handler) => harness.it(name, handler).todo();
export const skip = (name: string, handler: Handler) => harness.it(name, handler).skip();
export const report = (reporter: Notifier, opts?: { [name: string]: any }): Promise<number> =>
  harness.report(reporter, opts);

it.only = (name: string, handler: Handler) => harness.itOnly(name, handler);
it.skip = (name: string, handler: Handler) => harness.itSkip(name, handler);
it.todo = (name: string, handler: Handler) => harness.itToDo(name, handler);
describe.only = (name: string, define: Definer) => harness.describeOnly(name, define);
describe.skip = (name: string, define: Definer) => harness.describeSkip(name, define);
describe.todo = (name: string, define: Definer) => harness.describeToDo(name, define);
