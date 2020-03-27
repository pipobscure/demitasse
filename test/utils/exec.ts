import { spawn } from 'child_process';

export function exec(file: string) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.argv0, ['--no-warnings', file], { stdio: 'ignore', windowsHide: true });
    child.on('error', reject);
    child.on('close', resolve);
  });
}
