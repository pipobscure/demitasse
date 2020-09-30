#!/usr/bin/env -S node --no-warnings

import glob from 'glob';
import { spawn } from 'child_process';
import * as path from 'path';

const args = process.argv.slice(2);
const globalize = args[0] === '--global';
if (globalize) args.shift();

run(args[0] || 'test/**/*.js').then(
  (success) => process.exit(success ? 0 : 1),
  (error) => {
    console.error(error);
    process.exit(2);
  }
);

async function run(pattern: string) {
  const files = await findFiles(pattern);
  if (!files.length) throw new Error(`no files found for ${pattern}`);

  console.log('TAP version 13');
  if (files.length === 1) return 0 === (await runFile(files[0], ''));

  console.log(`1..${files.length}`);
  let failed = 0;
  for (let idx = 0; idx < files.length; idx++) {
    const file = files[idx];
    console.log(`# ${file}`);
    const result = await runFile(files[idx], '  ');
    failed += Math.min(result, 1);
    console.log(`${!result ? 'ok' : 'not ok'} ${idx + 1} - ${file}`);
  }
  console.log(`# Passed ${files.length - failed} of ${files.length}`);
  return !failed;
}

function runFile(file: string, indent: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = ['--no-warnings'];
    if (global) {
      args.push(path.join(__dirname, `global.js`));
    }
    args.push(path.resolve(file));
    const child = spawn(process.argv0, args, { stdio: ['ignore', 'pipe', 'inherit'], windowsHide: true });
    let buffer: string = '';
    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString('utf-8');
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() as string;
      lines.forEach((line) => writeLine(line, indent));
    });
    child.on('error', reject);
    child.on('close', (code) => {
      writeLine(buffer, indent);
      buffer = '';
      resolve(code);
    });
  });
}

function findFiles(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

function writeLine(line: string, indent: string = '') {
  if (/^\s*$/.test(line)) return;
  if (/^TAP\s+version\s+\d+/.test(line)) return;
  if (/^#\s+(?:Tests|Skipped|Passed|Failed):/.test(line)) return;
  console.log(`${indent}${line}`);
}
