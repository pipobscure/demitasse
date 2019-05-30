import { Case, Handler, SkipError } from './case';
import { Notifier, Status } from './notifier';

export class Suite extends Case {
  constructor(name: string, notifier: Notifier) {
    super(name, () => this.runCases(), notifier);
  }
  public get children(): number {
    return this.testCases.length;
  }
  private hookBefore: Handler[] = [];
  private hookBeforeEach: Handler[] = [];
  private testCases: Case[] = [];
  public get cases(): Case[] {
    return this.testCases.slice(0);
  }
  private hookAfterEach: Handler[] = [];
  private hookAfter: Handler[] = [];
  private async runCases() {
    this._status = this._status as number;
    let result = this._status;
    await this.runHooks(this.hookBefore);
    for (let testcase of this.testCases) {
      if (this.isSkipped) testcase.skip();
      try {
        if (!testcase.isSkipped) await this.runHooks(this.hookBeforeEach);
        await testcase.execute();
        if (!testcase.isSkipped) await this.runHooks(this.hookAfterEach);
      } catch (err) {
        testcase.fail(err);
        throw err;
      }
      result |= testcase.status as number;
    }
    await this.runHooks(this.hookAfter);
    this._status = result;
  }
  private async runHooks(hooks: Handler[]) {
    for (let hook of hooks) {
      await hook();
    }
  }
  public add(testCase: Case): void {
    this.testCases.push(testCase);
    if (this._prestate & Status.skip) testCase.skip();
    if (this._prestate & Status.todo) testCase.todo();
  }
  public skip(reason?: string): Case {
    if (reason) this._reason = this._reason || new SkipError(reason);
    this._prestate |= Status.skip;
    return this;
  }
  public unskip(): Case {
    if (this._reason instanceof SkipError) this._reason = undefined;
    this._prestate &= ~Status.skip;
    return this;
  }
  public todo(): Case {
    this._prestate |= Status.todo;
    for (let test of this) test.todo();
    return this;
  }
  public before(handler: Handler) {
    this.hookBefore.push(handler);
  }
  public beforeEach(handler: Handler) {
    this.hookBeforeEach.push(handler);
  }
  public afterEach(handler: Handler) {
    this.hookAfterEach.push(handler);
  }
  public after(handler: Handler) {
    this.hookAfter.push(handler);
  }
  public [Symbol.iterator](): Iterator<Case> {
    return this.testCases[Symbol.iterator]() as Iterator<Case>;
  }
}
