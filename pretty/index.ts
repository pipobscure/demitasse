import { Notifier, TestCase } from '../bdd/lib/notifier';
import chalk from 'chalk';
import { inspect } from 'util';
import { AssertionError } from 'assert';

const INSPECTOPTS = { colors: true, compact: true, getters: true };
interface WriteLine {
  (line: string): void;
}

const TODO = '\u2610';
const SKIP = '\u2740';
const GOOD = '\u2611';
const FAIL = '\u2612';

class Pretty implements Notifier {
  constructor(private readonly write: WriteLine) {}
  private caseStack: TestCase[] = [];
  private good = 0;
  private skip = 0;
  private todo = 0;
  private fail = 0;
  private get indent() {
    return new Array(this.caseStack.length).fill('  ').join('');
  }
  public notifyInit(options: { [name: string]: boolean | number | string }, cases: TestCase[]): void {}
  public notifyStart(current: TestCase): void {
    if (current.children) {
      this.write(`${this.indent}${chalk.magenta.underline(current.name)}`);
    }
    this.caseStack.unshift(current);
  }
  public notifyFinish(current: TestCase): void {
    this.caseStack.shift();
    if (!current.children) {
      if (current.isSkipped) {
        this.skip++;
        this.write(`${this.indent}${chalk.cyan(`${SKIP} ${current.name}`)}`);
        if (current.reason) this.writeReason(current);
      } else if (current.isToDo) {
        this.todo++;
        this.write(`${this.indent}${chalk.blue(`${TODO} ${current.name}`)}`);
        if (current.reason) this.writeReason(current);
      } else if (current.isFailure) {
        this.fail++;
        this.write(`${this.indent}${chalk.redBright(`${FAIL} ${current.name}`)}`);
        if (current.reason) this.writeReason(current);
      } else {
        this.good++;
        this.write(`${this.indent}${chalk.green(`${GOOD} ${current.name}`)}`);
      }
    }
  }
  public notifyError(error: Error): void {}
  public notifyComplete(): void {
    this.write('');
    this.write('');
    this.write(chalk.green(`${pad(this.good)} ${GOOD} passed`));
    this.write(chalk.redBright(`${pad(this.fail)} ${FAIL} failed`));
    this.write(chalk.cyan(`${pad(this.skip)} ${SKIP} skipped`));
    this.write(chalk.blue(`${pad(this.todo)} ${TODO} to-do`));
    this.write('');
  }
  private writeReason(testCase: TestCase) {
    if (!testCase.reason) return;
    const reason = testCase.reason;
    // @ts-ignore
    if (reason.code === 'ERR_SKIP') {
      this.write(`${this.indent}  ${chalk.cyan.dim('\u21D6' + reason.message)}`);
      return;
    }

    if ((reason as AssertionError).code === 'ERR_ASSERTION') {
      const assertion = reason as AssertionError;
      this.write(`${this.indent}    ${chalk.red.dim(`assertion: ${assertion.message}`)}`);
      let lines = inspect(assertion.expected, INSPECTOPTS).split(/\r?\n/);
      this.write(
        `${this.indent}    ${chalk.cyan.dim(`expected: ${lines.length > 1 ? '' : inspect(assertion.expected)}`)}`
      );
      if (lines.length > 1) lines.forEach((line, lnr) => this.write(`${this.indent}      ${line}`));
      lines = inspect(assertion.actual, INSPECTOPTS).split(/\r?\n/);
      this.write(`${this.indent}    ${chalk.blue.dim(`actual: ${lines.length > 1 ? '' : inspect(assertion.actual)}`)}`);
      if (lines.length > 1) lines.forEach((line, lnr) => this.write(`${this.indent}      ${line}`));
    } else if (reason instanceof Error) {
      const stack = (reason.stack || '').split(/\r?\n/);
      this.write(`${this.indent}    ${chalk.red.dim(`error: ${stack[0]}`)}`);
      this.write(`${this.indent}    ${chalk.yellow.dim(`location: ${stack[1].trim().replace(/^at\s*/, '')}`)}`);
    } else {
      inspect(reason, INSPECTOPTS)
        .split(/\r?\n/)
        .forEach((line) => this.write(`${this.indent}    ${chalk.dim(line)}`));
    }
  }
}

function pad(num: number): string {
  return `      ${num}`.slice(-4);
}

export const reporter = new Pretty((line) => console.log(line));
