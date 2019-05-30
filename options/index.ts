import { basename } from 'path';
import { stringify } from 'querystring';
import { exec } from 'child_process';

export interface Validator {
  (option : Option) : boolean;
}

export abstract class Option {
  constructor(public readonly name : string) {}
  protected _value: any;
  protected _description : string = '';
  public describe(text : string) : void {
    this._description = text;
  };
  abstract parse(args : string[]) : string[];
  abstract get value() : any;
  abstract get description(): string;
  abstract get valid() : boolean;
}

export class Param extends Option {
  constructor(name : string) {
    super(name);
  }
  public get value() : string {
    return this._value;
  }
  public get description() : string {
    let dfl = '';
    if (undefined !== this._value) {
      dfl = ` (default: ${JSON.stringify(this._value)})`;
    }
    return `--${this.name}=<value> : ${this._description}${dfl}`;
  }
  public get valid(): boolean { return this.validator(this); }
  public default(value : string) {
    this._value = value;
  }
  private validator : Validator = ()=>true;
  public validate(validator : Validator) : void {
    this.validator = validator;
  }
  public parse(args : string[]) : string[] {
    if (args[0] === `--${this.name}`) {
      args.shift();
      this._value = args.shift();
    } else if (args[0].slice(0, this.name.length + 3) === `--${this.name}=`) {
      this._value = args[0].slice(this.name.length + 3);
      args.shift();
    }
    return args;
  }
}

export class OptInFlag extends Option {
  constructor(name : string, public readonly short : string = name[0].toLocaleLowerCase()) {
    super(name);
    this._value = false;
  }
  public get value() : boolean {
    return !!this._value;
  }
  public get description() : string {
    return `--${this.name} / -${this.short} : ${this._description}`;
  }
  public get valid(): boolean { return true; }
  public parse(args : string[]) : string[] {
    if (args[0] === `--${this.name}` || args[0] === `-${this.short}`) {
      this._value = true;
      args.shift();
    } else if (args[0] === `--no-${this.name}`) {
      this._value = false;
      args.shift();
    }
    return args;
  }
}

export class OptOutFlag extends Option {
  constructor(name: string, public readonly short: string = name[0].toLocaleLowerCase()) {
    super(name);
    this._value = true;
  }
  public get value(): boolean {
    return !!this._value;
  }
  public get description(): string {
    return `--${this.name} / -${this.short} : ${this._description}`;
  }
  public get valid() : boolean { return true; }
  public parse(args: string[]): string[] {
    if (args[0] === `--${this.name}` || args[0] === `-${this.short}`) {
      this._value = false;
      args.shift();
    } else if (args[0] === `--no-${this.name}`) {
      this._value = true;
      args.shift();
    }
    return args;
  }
}

export interface Executor {
  (options : { [ name : string ] : any }, args : string[]) : Promise<void>;
}


export class Command {
  constructor(public readonly name: string, public readonly executor: Executor) { }
  protected options: Option[] = [];
  protected arguments: string[] = [];
  public parse(args : string[]) : Command {
    while (args.length && args[0][0] === '-') {
      let count = args.length;
      for (let option of this.options) {
        args = option.parse(args);
      }
      if (args.length === count) {
        console.error(`unknown option ${args[0]}`);
        throw new CommandError(this);
      }
    }
    this.arguments = args.slice(0);
    return this;
  }
  private validate() : boolean {
    return this.options.reduce((agg, cur)=>(agg && cur.valid), true);
  }
  public async execute() {
    if (!this.validate()) {
      throw new CommandError(this);
    }
    const options = this.options.reduce((opts : { [ name : string ] : any }, cur)=>{
      opts[cur.name]=cur.value;
      return opts;
    }, Object.create(null));
    return await this.executor(options, this.arguments.slice(0));
  }
  public usage() : string {
    const lines = [ `${ this.name } [options] [arguments]` ];
    this.options.forEach(opt => lines.push(`  ${opt.description}`));
    return lines.join('\n');
  }
  public flag(name: string, short: string, description: string, deflt: boolean = false) {
    const flag = deflt ? new OptOutFlag(name, short) : new OptInFlag(name, short);
    flag.describe(description);
    this.options.push(flag);
    return this;
  }
  public option(name: string, description: string, deflt?: string, valid?: Validator) : Command {
    const opt = new Param(name);
    opt.describe(description);
    if (deflt) opt.default(deflt);
    if (valid) opt.validate(valid);
    this.options.push(opt);
    return this;
  }

}

export class CommandError extends Error {
  constructor(public readonly command: Command) {
    super(`failed to run ${command.name} `);
  }
}

export class Program {
  constructor(public readonly name: string = basename(process.argv[1], '.js'), main?: Executor) {
    this.main = new Command(name, main ? main : async () => {
      console.error(this.usage());
      throw null;
    });
  }
  private commands : { [ name : string ]: Command } = Object.create(null);
  public readonly main : Command;
  private cmd?: Command;
  public async run(args : string[]) {
    args = args.slice(2);
    this.cmd = (args[0] in this.commands) ? this.commands[args.shift() as string] : this.main;
    try {
      this.cmd.parse(args);
      await (this.cmd as Command).execute();
    } catch (err) {
      if (err) {
        if (!(err instanceof CommandError)) console.debug(err);
        console.error((this.cmd as Command).usage());
      }
      process.exit(1);
    }
  }
  public usage() : string {
    return Object.keys(this.commands).map((name) => this.commands[name].usage()).join('\n\n');
  };
  public command(name : string, executor?: Executor) : Command {
    if (executor) {
      if (this.commands[name]) throw new Error(`command ${name} already exists`);
      this.commands[name] = new Command(name, executor);
    }
    return this.commands[name];
  }
}
