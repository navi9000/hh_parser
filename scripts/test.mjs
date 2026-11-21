import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2).filter((argument) => argument !== '--');

function run(commandArgs) {
  const result = spawnSync('pnpm', commandArgs, {
    cwd: root,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`Unable to run pnpm: ${result.error.message}`);
    process.exit(1);
  }

  return result.status ?? 1;
}

if (args.length === 0) {
  const commands = [
    ['--filter', '@hh-scraper/api', 'test'],
    ['--filter', '@hh-scraper/web', 'test'],
    ['--filter', '@hh-scraper/browser', 'test'],
    ['exec', 'playwright', 'test'],
  ];

  for (const command of commands) {
    const status = run(command);
    if (status !== 0) {
      process.exit(status);
    }
  }
  process.exit(0);
}

if (args.length !== 1) {
  console.error('Usage: pnpm test [path-to-test-file]');
  process.exit(2);
}

const file = resolve(root, args[0]);
const relativeFile = relative(root, file).split(sep).join('/');

if (
  relativeFile.startsWith('../') ||
  !/^(?:apps\/(?:api|web|browser)|tests\/e2e)\/[\w./-]+\.(?:spec|test)\.ts$/.test(
    relativeFile,
  ) ||
  !existsSync(file)
) {
  console.error(`Not a known test file: ${args[0]}`);
  process.exit(2);
}

const unitTest = relativeFile.match(
  /^apps\/(api|web|browser)\/(.+\.(spec|test)\.ts)$/,
);
const e2eTest = /^tests\/e2e\/.+\.(spec|test)\.ts$/.test(relativeFile);

if (!unitTest && !e2eTest) {
  console.error(`Not a known test file: ${args[0]}`);
  process.exit(2);
}

const command = unitTest
  ? [
      '--filter',
      `@hh-scraper/${unitTest[1]}`,
      'test',
      unitTest[2],
    ]
  : ['exec', 'playwright', 'test', relativeFile];
process.exit(run(command));
