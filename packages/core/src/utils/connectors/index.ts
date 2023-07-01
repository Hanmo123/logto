import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ConnectorFactory } from '@logto/cli/lib/connector/index.js';
import { loadConnectorFactories as _loadConnectorFactories } from '@logto/cli/lib/connector/index.js';
import { connectorDirectory } from '@logto/cli/lib/constants.js';
import { getConnectorPackagesFromDirectory } from '@logto/cli/lib/utils.js';
import {
  demoConnectorIds,
  serviceConnectorIds,
  ConnectorType,
  type EmailConnector,
  type SmsConnector,
} from '@logto/connector-kit';
import type { ConnectorFactoryResponse, ConnectorResponse } from '@logto/schemas';
import { findPackage } from '@logto/shared';
import { conditional, deduplicate, pick, trySafe } from '@silverhand/essentials';

import { EnvSet } from '#src/env-set/index.js';
import RequestError from '#src/errors/RequestError/index.js';

import { type LogtoConnector } from './types.js';

export const isPasswordlessLogtoConnector = (
  connector: LogtoConnector
): connector is LogtoConnector<EmailConnector | SmsConnector> =>
  connector.type !== ConnectorType.Social;

export const transpileLogtoConnector = async (
  connector: LogtoConnector,
  extraInfo?: Record<string, unknown>
): Promise<ConnectorResponse> => {
  const usagePayload = conditional(
    /** Should do the check in advance since only passwordless connectors could have `getUsage` method. */
    isPasswordlessLogtoConnector(connector) &&
      connector.getUsage && {
        usage: await trySafe(connector.getUsage(new Date(connector.dbEntry.createdAt))),
      }
  );
  const { dbEntry, metadata, type } = connector;
  const { config, connectorId: id } = dbEntry;
  /** Temporarily block entering Logto email connector as well until this feature is ready for prod. */
  const isDemo = demoConnectorIds.includes(id) || serviceConnectorIds.includes(id);

  return {
    type,
    ...metadata,
    ...pick(dbEntry, 'id', 'connectorId', 'syncProfile', 'metadata'),
    isDemo,
    extraInfo,
    // Hide demo connector config
    config: isDemo ? {} : config,
    ...usagePayload,
  };
};

export const transpileConnectorFactory = ({
  metadata,
  type,
}: ConnectorFactory): ConnectorFactoryResponse => {
  return {
    type,
    ...metadata,
    /** Temporarily block entering Logto email connector as well until this feature is ready for prod. */
    isDemo: demoConnectorIds.includes(metadata.id) || serviceConnectorIds.includes(metadata.id),
  };
};

const checkDuplicateConnectorFactoriesId = (connectorFactories: ConnectorFactory[]) => {
  const connectorFactoryIds = connectorFactories.map(({ metadata }) => metadata.id);
  const deduplicatedConnectorFactoryIds = deduplicate(connectorFactoryIds);

  if (connectorFactoryIds.length !== deduplicatedConnectorFactoryIds.length) {
    const duplicatedConnectorFactoryIds = deduplicatedConnectorFactoryIds.filter(
      (deduplicateId) => connectorFactoryIds.filter((id) => id === deduplicateId).length > 1
    );
    throw new RequestError({
      code: 'connector.more_than_one_connector_factory',
      status: 422,
      connectorIds: duplicatedConnectorFactoryIds.map((id) => `${id}`).join(', '),
    });
  }
};

export const loadConnectorFactories = async () => {
  const currentDirname = path.dirname(fileURLToPath(import.meta.url));
  const cliDirectory = await findPackage(currentDirname);
  const coreDirectory = cliDirectory && path.join(cliDirectory, '../core');
  const directory = coreDirectory && path.join(coreDirectory, connectorDirectory);

  if (!directory || !existsSync(directory)) {
    return [];
  }

  const connectorPackages = await getConnectorPackagesFromDirectory(directory);

  const connectorFactories = await _loadConnectorFactories(
    connectorPackages,
    EnvSet.values.isIntegrationTest || EnvSet.values.ignoreConnectorVersionCheck
  );

  checkDuplicateConnectorFactoriesId(connectorFactories);

  return connectorFactories;
};
