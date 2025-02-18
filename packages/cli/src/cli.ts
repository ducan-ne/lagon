import { program } from 'commander';
import { version } from '../package.json';
import { loggedInGuard } from './auth';
import { build } from './commands/build';
import { deploy } from './commands/deploy';
import { dev } from './commands/dev';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { undeploy } from './commands/undeploy';

export function runCli() {
  program.name('lagon').description('Deploy Serverless Functions at the Edge').version(version);
  program.command('login').description('Login to Lagon').action(login);
  program.command('logout').description('Logout from Lagon').action(logout);
  program
    .command('deploy')
    .description('Deploy the given file')
    .argument('<file>', 'The file to deploy')
    .option('--preact', 'Bundle the function as a preact site (deprecated, use --client)')
    .option('-c, --client <file>', 'Bundle this file as a client-side script')
    .option('-p, --public-dir <dir>', 'The directory to serve the public assets from', 'public')
    .option('-f, --force', 'Force the creation of a new Function')
    .action(loggedInGuard(deploy));
  program
    .command('remove')
    .alias('rm')
    .description('Undeploy the given file')
    .argument('<file>', 'The file unto deploy')
    .action(loggedInGuard(undeploy));
  program
    .command('dev')
    .description('Launch a local dev server')
    .argument('<file>', 'The file to serve')
    .option('--port <port>', 'Specify dev server port number', '1234')
    .option('--host <host>', 'Specify dev server host name', 'localhost')
    .option('--preact', 'Bundle the function as a preact site (deprecated, use --client)')
    .option('-c, --client <file>', 'Bundle this file as a client-side script')
    .option('-p, --public-dir <dir>', 'The directory to serve the public assets from', 'public')
    .action(dev);
  program
    .command('build')
    .description('Build the given file but do not deploy it, useful for debug purposes')
    .argument('<file>', 'The file to build')
    .option('--preact', 'Bundle the function as a preact site (deprecated, use --client)')
    .option('-c, --client <file>', 'Bundle this file as a client-side script')
    .option('-p, --public-dir <dir>', 'The directory to serve the public assets from', 'public')
    .action(build);

  program.parse();
}
