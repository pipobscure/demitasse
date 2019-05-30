export enum Status {
  failure = 1,
  todo = 2,
  skip = 4
}

export abstract class TestCase implements Iterable<TestCase> {
  public abstract readonly name: string;
  public abstract readonly status: number;
  public abstract readonly expectation: number;
  public abstract readonly reason: Error | undefined;
  public abstract readonly children: number;
  public get isSuccess(): boolean {
    return !this.isFailure;
  }
  public get isFailure(): boolean {
    return !!(this.status & Status.failure);
  }
  public get isToDo(): boolean {
    return !!(this.status & Status.todo) || !!(this.expectation & Status.todo);
  }
  public get isSkipped(): boolean {
    return !!(this.status & Status.skip) || !!(this.expectation & Status.skip);
  }
  public abstract [Symbol.iterator](): Iterator<TestCase>;
}

export interface Notifier {
  notifyInit(options: { [name: string]: number | string | boolean }, cases?: TestCase[]): void;
  notifyError(error: Error): void;
  notifyStart(testCase: TestCase): void;
  notifyFinish(testCase: TestCase): void;
  notifyComplete(): void;
}
