import { Notifier, TestCase } from '../bdd/lib/notifier';

class Reporter implements Notifier {
  constructor() {}
  protected stack: TestCase[] = [];
  protected lastClosed: boolean = false;
  get indent() {
    return new Array(this.stack.length).fill('  ').join('');
  }
  public notifyInit(options: { [name: string]: boolean | number | string }, cases: TestCase[]): void {
    console.log(`${this.indent}[`);
  }
  public notifyStart(current: TestCase): void {
    if (this.lastClosed) console.log(`${this.indent},`);
    console.log(`${this.indent}  {`);
    console.log(`${this.indent}    "name": ${JSON.stringify(current.name)},`);
    console.log(`${this.indent}    "cases": [`);
    this.stack.unshift(current);
    this.lastClosed = false;
  }
  public notifyFinish(current: TestCase): void {
    this.stack.shift();
    console.log(`${this.indent}    ],`);
    console.log(`${this.indent}    "success": ${current.isSuccess},`);
    console.log(`${this.indent}    "todo": ${current.isToDo},`);
    console.log(`${this.indent}    "skipped": ${current.isSkipped},`);
    if (!current.reason) {
      console.log(`${this.indent}    "reason": null`);
    } else {
      console.log(`${this.indent}    "reason": {`);
      for (let name in current.reason) {
        //@ts-ignore
        console.log(`${this.indent}      ${JSON.stringify(name)}: ${JSON.stringify(current.reason[name])},`);
      }
      console.log(`${this.indent}      "toString()": ${JSON.stringify('' + current.reason)}`);
      console.log(`${this.indent}    }`);
    }
    console.log(`${this.indent}  }`);

    this.lastClosed = true;
  }
  public notifyComplete(): void {
    console.log(`${this.indent}]`);
  }
  public notifyError(error: Error): void {
    console.error(error);
  }
}

export const reporter = new Reporter();
