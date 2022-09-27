import { execSync } from 'child_process';
import { createWriteStream } from 'fs';

import axios from 'axios';

export const isVersionGreaterThan = (version: string, targetMajor: number) =>
  Number(version.split('.')[0]) >= targetMajor;

export const trimV = (version: string) => (version.startsWith('v') ? version.slice(1) : version);

export const safeExecSync = (command: string) => {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch {}
};

export const downloadFile = async (url: string, destination: string) => {
  const file = createWriteStream(destination);
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(file);

  return new Promise((resolve, reject) => {
    file.on('error', (error) => {
      reject(error.message);
    });
    file.on('finish', () => {
      file.close();
      resolve(file);
    });
  });
};
