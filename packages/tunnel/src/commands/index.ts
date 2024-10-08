import http from 'node:http';

import { isValidUrl } from '@logto/core-kit';
import { conditional } from '@silverhand/essentials';
import chalk from 'chalk';
import type { CommandModule } from 'yargs';

import { consoleLog } from '../utils.js';

import { type TunnelCommandArgs } from './types.js';
import {
  checkExperienceInput,
  createLogtoResponseHandler,
  createProxy,
  createStaticFileProxy,
  isLogtoRequestPath,
} from './utils.js';

const tunnel: CommandModule<unknown, TunnelCommandArgs> = {
  command: ['$0'],
  describe: 'Command for Logto tunnel',
  builder: (yargs) =>
    yargs.options({
      'experience-uri': {
        alias: ['uri'],
        describe: 'The URI of your custom sign-in experience page.',
        type: 'string',
      },
      'experience-path': {
        alias: ['path'],
        describe: 'The local folder path of your custom sign-in experience assets.',
        type: 'string',
      },
      endpoint: {
        describe:
          'Logto endpoint URI that points to your Logto Cloud instance. E.g.: https://<tenant-id>.logto.app/',
        type: 'string',
      },
      port: {
        alias: 'p',
        describe: 'The port number where the tunnel service will be running on. Defaults to 9000.',
        type: 'number',
        default: 9000,
      },
      verbose: {
        describe: 'Show verbose output.',
        type: 'boolean',
        default: false,
      },
    }),
  handler: async ({ 'experience-uri': url, 'experience-path': path, endpoint, port, verbose }) => {
    checkExperienceInput(url, path);

    if (!endpoint || !isValidUrl(endpoint)) {
      consoleLog.fatal('A valid Logto endpoint URI must be provided.');
    }
    const logtoEndpointUrl = new URL(endpoint);

    const startServer = (port: number) => {
      const tunnelServiceUrl = new URL(`http://localhost:${port}`);

      const proxyLogtoRequest = createProxy(
        logtoEndpointUrl.href,
        async (proxyResponse, request, response) =>
          createLogtoResponseHandler({
            proxyResponse,
            request,
            response,
            logtoEndpointUrl,
            tunnelServiceUrl,
            verbose,
          })
      );
      const proxyExperienceServerRequest = conditional(url && createProxy(url));
      const proxyExperienceStaticFileRequest = conditional(path && createStaticFileProxy(path));

      const server = http.createServer((request, response) => {
        consoleLog.info(`[${chalk.green(request.method)}] ${request.url}`);

        // Tunneling the requests to Logto endpoint
        if (isLogtoRequestPath(request.url)) {
          void proxyLogtoRequest(request, response);
          return;
        }

        if (proxyExperienceServerRequest) {
          void proxyExperienceServerRequest(request, response);
          return;
        }

        if (proxyExperienceStaticFileRequest) {
          void proxyExperienceStaticFileRequest(request, response);
        }
      });

      server.listen(port, () => {
        const serviceUrl = new URL(`http://localhost:${port}`);
        consoleLog.info(
          `🎉 Logto tunnel service is running!
  ${chalk.green('➜')} Your custom sign-in UI is hosted on: ${chalk.blue(serviceUrl.href)}

  ${chalk.green('➜')} Don't forget to update Logto endpoint URI in your app:

      ${chalk.gray('From:')} ${chalk.bold(endpoint)}
      ${chalk.gray('To:')}   ${chalk.bold(serviceUrl.href)}

  ${chalk.green(
    '➜'
  )} If you are using social sign-in, make sure the social redirect URI is also set to:

      ${chalk.bold(`${serviceUrl.href}callback/<connector-id>`)}

  ${chalk.green('➜')} ${chalk.gray(`Press ${chalk.white('Ctrl+C')} to stop the tunnel service.`)}
  ${chalk.green('➜')} ${chalk.gray(`Use ${chalk.white('--verbose')} to print verbose output.`)}
          `
        );
      });

      server.on('error', (error: Error) => {
        if ('code' in error && error.code === 'EADDRINUSE') {
          consoleLog.error(`Port ${port} is already in use, trying another one...`);
          startServer(port + 1);
          return;
        }
        consoleLog.fatal(`Tunnel service failed to start. ${error.message}`);
      });
    };

    startServer(port);
  },
};

export default tunnel;
