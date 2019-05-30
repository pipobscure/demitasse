import { Notifier, TestCase } from '../bdd/lib/notifier';
import YAML from 'yaml';
import { AssertionError } from 'assert';

interface WriteLine {
  (line: string): void;
}

class Tap implements Notifier {
  constructor(private readonly write: WriteLine) {}
  private flat: boolean = false;
  private count: number = 0;
  private caseStack: { testCase?: TestCase; count: number }[] = [{ count: 0 }];
  private get indent(): string {
    return new Array(this.caseStack.length - 1).fill('  ').join('');
  }
  public notifyInit(options: { [name: string]: number | string | boolean }, cases?: TestCase[]): void {
    console.error('FLAT: ' + options.flat);
    this.write(`# TAP version 13`);
    this.flat = !!options.flat;
    if (!this.flat) this.write(`1..${cases ? cases.length : 0}`);
  }
  public notifyStart(current: TestCase): void {
    this.caseStack.unshift({ testCase: current, count: 0 });
    if (this.caseStack[1].testCase && !this.caseStack[1].count) {
      this.caseStack[1].count = this.caseStack[1].testCase.children;
    }
    this.caseStack[1].count = Math.max(0, this.caseStack[1].count - 1);
    if (!this.flat && current.children) this.writePlan(current);
  }
  public notifyFinish(current: TestCase): void {
    const { testCase, count } = this.caseStack.shift() || this.throwError(new Error('no current test-case'));
    if (testCase !== current || !!count) throw new Error('invalid event order');
    const idx = !this.caseStack[0].testCase ? 1 : this.caseStack[0].testCase.children - this.caseStack[0].count;
    this.count++;
    let name;
    if (this.flat) {
      const parts = this.caseStack
        .filter((i) => i.testCase)
        .map((i) => (i.testCase ? i.testCase.name : ''))
        .reverse();
      parts.push(testCase.name);
      name = parts.join(' - ');
    }
    this.writePoint(this.flat ? this.count : idx, testCase, name);
  }
  public notifyError(error: Error): void {
    console.error(error);
  }
  public notifyComplete(): void {
    if (this.flat) {
      this.write(`1..${this.count}`);
    }
  }
  private writePlan(testCase: TestCase) {
    this.write(`${this.indent}# ${testCase.name}`);
    this.write(`${this.indent}1..${testCase.children}`);
  }
  private writePoint(idx: number, testCase: TestCase, name?: string) {
    const parts: string[] = [];
    parts.push(
      this.flat ? '' : this.indent,
      testCase.isSuccess ? 'ok' : 'not ok',
      ` ${idx}`,
      ' - ',
      name || testCase.name
    );
    if (testCase.isSkipped) {
      const reason = testCase.reason ? `: ${testCase.reason.message}` : '';
      parts.push(` # Skipped${reason}`);
    }
    if (testCase.isToDo) {
      const reason = testCase.reason ? `: ${testCase.reason.message}` : '';
      parts.push(` # ToDo${reason}`);
    }
    this.write(parts.join(''));
    if (testCase.isFailure && testCase.reason) this.writeReason(testCase);
  }
  private writeReason(testCase: TestCase) {
    if (!testCase.reason) return;
    const reason = testCase.reason;
    this.write(`${this.indent}  ---`);
    if ((reason as AssertionError).code === 'ERR_ASSERTION') {
      const assertion = reason as AssertionError;
      this.write(`${this.indent}  message: ${assertion.message}`);
      this.write(`${this.indent}  expected: ${JSON.stringify(assertion.expected)}`);
      this.write(`${this.indent}  actual: ${JSON.stringify(assertion.actual)}`);
    } else if (reason instanceof Error) {
      const stack = (reason.stack || '').split(/\r?\n/);
      this.write(`${this.indent}  error: ${stack[0]}`);
      this.write(`${this.indent}  location: ${stack[1].trim().replace(/^at\s*/, '')}`);
    } else {
      YAML.stringify(reason)
        .split(/\r?\n/)
        .forEach((line) => this.write(`${this.indent}  ${line}`));
    }
    this.write(`${this.indent}  ...`);
  }
  private throwError(err: Error): never {
    throw err;
  }
}

export const reporter = new Tap((line) => console.log(line));
