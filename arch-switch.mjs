#!/bin/sh -
':'; /*-
test1=$(bun --version 2>&1) && exec bun "$0" "$@"
test2=$(node --version 2>&1) && exec node "$0" "$@"
exec printf '%s\n' "$test1" "$test2" 1>&2
*/

console.log(
  `\n\nRunning '${['npx-bun-demo (arch-switch) |>', ...process.argv.slice(2)].join(' ')}' with: ${process.isBun ? 'bun' : 'node'}`
);

import { spawn } from 'child_process';
import { arch as osArch, platform as osPlatform } from 'os';

const KnownArchitectures = ['arm64', 'x64'];
const KnownOperatingSystems = ['linux', 'windows', 'darwin'];
const InvalidCombinations = ['windows-arm64'];

const arch = osArch();
const _platform = osPlatform();
const platform = _platform === 'win32' ? 'windows' : _platform;

function ExitError(str) {
  console.log(`\n\n`);
  console.log(
    '\x1b[1m\x1b[4m\x1b[31m\x1b[40m',
    `\t\t${str}\t\t`
  );
  console.log(`\n\n`);
  process.exit(1);
}

if (!KnownArchitectures.includes(arch)) {
  ExitError(`Unsupported architecture '${arch}'`);
}

if (!KnownOperatingSystems.includes(platform)) {
  ExitError(`Unsupported platform '${platform}'`);
}

const executableName = `${platform}-${arch}`;
if (InvalidCombinations.includes(executableName)) {
  ExitError(`Unsupported architecture '${arch}' for current platform '${platform}'`);
}

spawn(
  `./dist/bun-${executableName}-modern-npx-bun-demo${platform === 'windows' ? '.exe' : ''}`,
  process.argv.slice(2),
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  }
);
