#!/bin/sh -
':'; /*-
test1=$(bun --version 2>&1) && exec bun "$0" "$@"
test2=$(node --version 2>&1) && exec node "$0" "$@"
exec printf '%s\n' "$test1" "$test2" 1>&2
*/
import { existsSync } from 'fs';
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

async function fetchAsset() {
  const { readFileSync, createWriteStream, mkdirSync } = await import('fs');
  const { Readable } = await import('stream');
  const { finished } = await import('stream/promises');

  mkdirSync('./dist', { recursive: true });

  const version = JSON.parse(readFileSync('./package.json', 'utf8')).version;
  const fileName = `bun-${executableName}-modern-npx-bun-demo${platform === 'windows' ? '.exe' : ''}`;
  const downloadSrc = `https://raw.githubusercontent.com/runspired/npx-bun-demo/refs/tags/v${version}/dist/${fileName}`;
  const result = await fetch(downloadSrc);
  const dest = createWriteStream(`./dist/${fileName}`);
  
  await finished(Readable.fromWeb(result.body).pipe(dest));
}

if (!existsSync(`./dist/${fileName}`)) {
  fetchAsset();
}