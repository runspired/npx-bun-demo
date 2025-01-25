import chalk from 'chalk';

console.log(chalk.grey(`\n\nHello from Bun ${chalk.cyan(Bun.version)} build ${chalk.yellow(Bun.revision)}!\n\n`));