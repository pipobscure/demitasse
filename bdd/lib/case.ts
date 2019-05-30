import { TestCase, Notifier, Status } from './notifier';

export class SkipError extends Error {
  constructor(msg: string) {
    super(msg);
    this.message = msg;
  }
  public readonly code: string = 'ERR_SKIP';
}

export interface Handler {
  (): Promise<void>;
}

export class Case extends TestCase {
  constructor(public name: string, public readonly handler: Handler, protected readonly notifier: Notifier) {
    super();
  }
  protected _prestate: number = 0;
  public get expectation(): number {
    return this._prestate;
  }
  protected _status: number | undefined;
  public get status(): number {
    return this._status || 0;
  }
  protected _reason: Error | undefined;
  public get reason(): Error | undefined {
    return this._reason;
  }
  public get children() {
    return 0;
  }
  public async execute() {
    this._status = this._prestate;
    this.notifier.notifyStart(this);
    try {
      if (!this.isSkipped || !!this.children) {
        await this.handler();
      }
    } catch (err) {
      this.fail(err);
    }
    this.notifier.notifyFinish(this);
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
    return this;
  }
  public fail(reason: Error): Case {
    this._status = this._status as number;
    this._reason = this._reason || reason;
    this._status |= Status.failure;
    return this;
  }
  public [Symbol.iterator](): Iterator<Case> {
    return {
      next: (value?: any) => ({ done: true } as IteratorResult<Case>)
    };
  }
}
