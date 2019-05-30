# Command Line Interface Options

Simple and small options parser for CLI applications.

**Large dependencies are a problem. Use them sparingly but whenever useful. When creating them, keep them light.**

## Install

```bash
npm install --save @pipobscure/options
```

## Usage

### Simple Program

```javascript
import { basename } from 'path';
import { Program } from '@pipobscure/options';

const program = new Program(basename(process.argv[1], '.js'), (opts, args)=>{
  // Do your main stuff here
});
program.main.flag('long', 'l', 'describe what long does', false /*default*/);
program.main.option('something', 'describe what --somethig=<value> or --something <value> does', 'default value');
program.run(process.argv);
```

### Command-Based Program

```javascript
import { basename } from 'path';
import { Program } from '@pipobscure/options';

const program = new Program(basename(process.argv[1], '.js'));

const one = program.command('one', (opts, args)=>{
  // Do the stuff for command: one
});
one.flag('long', 'l', 'describe what long does for one', false /*default*/);
one.option('something', 'describe what --somethig=<value> or --something <value> does in one', 'default value', (option)=>!!~[ 'opt1', 'opt2' ].indexOf(option.value)); // defaults & validation is optional

const two = program.command('two', (opts, args)=>{
  // Do the stuff for command: two
});
two.flag('long', 'l', 'describe what long does for two', false /*default*/);
two.option('something', 'describe what --somethig=<value> or --something <value> does in two', 'default value');

program.run(process.argv);
```

## License

Copyright 2019 Philipp Dunkel, Bloomberg LP

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
