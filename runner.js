#!/usr/bin/env node --no-warnings

import glob from 'glob';
import { spawn } from 'child_process';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const globalize = args[0] === '--global';
if (globalize) args.shift();

run(args[0] || 'test/**/*.@(mjs|js)').then(
    (success) => process.exit(success ? 0 : 1),
    (error) => { console.error(error); process.exit(2); }
);

async function run(pattern) {
    const files = await findFiles(pattern);
    if (!files.length) throw new Error(`no files found for ${pattern}`);

    console.log('TAP version 13');
    if (files.length === 1) return 0 === await runFile(files[0], '');

    console.log(`1..${files.length}`);
    let failed = 0;
    for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        console.log(`# ${file}`)
        const result = await runFile(files[idx], '  ');
        failed += Math.min(result, 1);
        console.log(`${!result ? 'ok' : 'not ok'} ${idx + 1} - ${ file }`);
    }
    console.log(`# Passed ${files.length - failed} of ${files.length}`);
    return !failed;
}

function runFile(file, indent) {
    return new Promise((resolve, reject) => {
        const args = ['--no-warnings'];
        if (global) {
            args.push(path.join(__dirname, 'global.js'));
        }
        const child = spawn(process.argv0, [ ...args, file], { stdio: ['ignore', 'pipe', 'inherit'], windowsHide: true });
        let buffer = '';
        child.stdout.on('data', (chunk) => {
            buffer += chunk.toString('utf-8');
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop();
            lines.forEach((line)=>writeLine(line, indent));
        });
        child.on('error', reject);
        child.on('close', (code) => {
            writeLine(buffer, indent);
            buffer = '';
            resolve(code);
        });
    });
}

function findFiles(...args) {
    return new Promise((resolve, reject) => {
        glob(...args, (err, files) => {
            if (err) return reject(err);
            resolve(files);
        });
    });
}

function writeLine(line, indent = '') {
    if (/^\s*$/.test(line)) return;
    if (/^TAP\s+version\s+\d+/.test(line)) return;
    if (/^#\s+(?:Tests|Skipped|Passed|Failed):/.test(line)) return;
    console.log(`${indent}${line}`);
}
