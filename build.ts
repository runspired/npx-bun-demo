const KnownArchitectures = ['arm64', 'x64'];
// windows is deactivated because the demo stores the file in github which doesnt support files > 100MB
const KnownOperatingSystems = ['linux', /*'windows',*/ 'darwin'];
const InvalidCombinations = ['windows-arm64'];

outer: for (const arch of KnownArchitectures) {
  for (const platform of KnownOperatingSystems) {
    if (InvalidCombinations.includes(`${platform}-${arch}`)) continue;

    // compile the given architecture
    const target = `bun-${platform}-${arch}-modern`;
    const args = [
      'bun',
      'build',
      './src/index.ts',
      `--outfile=dist/${target}-npx-bun-demo`,
      '--compile',
      '--minify',
      '--bytecode',
      '--env=disable',
      '--sourcemap=none',
      `--target=${target}`,
    ];

    console.log(`executing: ${args.join(' ')}`);
    const proc = Bun.spawn(args, {
      env: process.env,
      cwd: process.cwd(),
      stderr: 'inherit',
      stdout: 'inherit',
      stdin: 'inherit',
    });
    const result = await proc.exited;
    if (result !== 0) {
      break outer;
    }
  }
}
