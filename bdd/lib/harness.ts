import { Case, Handler } from './case';
import { Suite } from './suite';
import { Notifier, TestCase } from './notifier';

export interface Definer {
  (): void;
}

export class Harness implements Notifier {
  constructor() {}
  private testCases: Case[] = [];
  private suiteStack: Suite[] = [];
  private failed: number = 0;
  private runner?: Promise<number>;
  public describe(name: string, define: Definer): Suite {
    if (this.runner) throw new Error('cannot define tests while running');
    const suite = new Suite(name, this);
    if (this.suiteStack.length) {
      this.suiteStack[0].add(suite);
    } else {
      this.testCases.push(suite);
    }
    this.suiteStack.unshift(suite);
    define();
    this.suiteStack.shift();
    return suite;
  }
  public before(handler: Handler): void {
    if (this.runner) throw new Error('cannot define tests while running');
    if (!this.suiteStack.length) throw new Error('before is only legal inside a describe');
    this.suiteStack[0].before(handler);
  }
  public beforeEach(handler: Handler): void {
    if (this.runner) throw new Error('cannot define tests while running');
    if (!this.suiteStack.length) throw new Error('beforeEach is only legal inside a describe');
    this.suiteStack[0].beforeEach(handler);
  }
  public afterEach(handler: Handler): void {
    if (this.runner) throw new Error('cannot define tests while running');
    if (!this.suiteStack.length) throw new Error('afterEach is only legal inside a describe');
    this.suiteStack[0].afterEach(handler);
  }
  public after(handler: Handler): void {
    if (this.runner) throw new Error('cannot define tests while running');
    if (!this.suiteStack.length) throw new Error('after is only legal inside a describe');
    this.suiteStack[0].after(handler);
  }
  public it(name: string, handler: Handler): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    const testCase = new Case(name, handler, this);
    if (this.suiteStack.length) {
      this.suiteStack[0].add(testCase);
    } else {
      this.testCases.push(testCase);
    }
    return testCase;
  }
  public timeout(name: string, timeout: number = 1000, handler: Handler): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    return this.it(name, async () => {
      return await Promise.race([
        sleep(timeout).then(() => {
          throw new Error('timeout');
        }),
        handler()
      ]);
    });
  }
  public itOnly(name: string, handler: Handler): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.it(name, handler);
    Promise.resolve({ test, tests: this.suiteStack[0] || this.testCases }).then(({ test, tests }) => {
      for (let item of tests) {
        item.skip();
      }
      test.unskip();
    });
    return test;
  }
  public itSkip(name: string, handler: Handler): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.it(name, handler);
    test.skip(name);
    return test;
  }
  public itToDo(name: string, handler: Handler): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.it(name, handler);
    test.todo();
    return test;
  }
  public describeOnly(name: string, define: Definer): Suite {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.describe(name, define);
    Promise.resolve({ test, tests: this.suiteStack[0] || this.testCases }).then(({ test, tests }) => {
      for (let item of tests) {
        item.skip();
      }
      test.unskip();
    });
    return test;
  }
  public describeSkip(name: string, define: Definer): Suite {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.describe(name, define);
    test.skip(name);
    return test;
  }
  public describeToDo(name: string, define: Definer): Case {
    if (this.runner) throw new Error('cannot define tests while running');
    const test = this.describe(name, define);
    test.todo();
    return test;
  }
  protected async run(options: { [name: string]: number | string | boolean }) {
    this.notifyInit(options, this.testCases);
    for (let testCase of this.testCases) {
      await testCase.execute();
    }
  }
  private reporter: Notifier | null = null;
  public report(reporter: Notifier, options: { [name: string]: number | string | boolean } = {}): Promise<number> {
    if (this.runner) return Promise.reject(new Error('already running'));
    this.reporter = reporter;
    this.failed = 0;
    return (this.runner = Promise.resolve().then(async () => {
      try {
        await this.run(options);
      } catch (err) {
        this.notifyError(err);
      }
      this.notifyComplete();
      this.runner = undefined;
      return this.failed;
    }));
  }
  public notifyInit(options: { [name: string]: number | string | boolean }, cases: TestCase[]): void {
    if (!this.reporter) throw new Error('missing reporter');
    this.reporter.notifyInit(options, cases);
  }
  public notifyError(error: Error): void {
    if (!this.reporter) {
      console.error((error && error.stack) || error);
      return;
    }
    this.reporter.notifyError(error);
  }
  public notifyStart(testCase: Case): void {
    if (!this.reporter) throw new Error('missing reporter');
    this.reporter.notifyStart(testCase);
  }
  public notifyFinish(testCase: Case): void {
    if (!this.reporter) throw new Error('missing reporter');
    this.failed += testCase.isFailure ? 1 : 0;
    this.reporter.notifyFinish(testCase);
  }
  public notifyComplete(): void {
    if (!this.reporter) throw new Error('missing reporter');
    this.reporter.notifyComplete();
  }
}
function sleep(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
