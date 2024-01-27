import { join } from 'path';
import { v4 } from 'uuid';

export const getLocalPath = (path: string = ''): string =>
  join(process.cwd(), 'apps/core-api/', path);

export const getAssetsDirPath = (): string => getLocalPath('src/assets');

export const getUniqTempDirPath = (): string => {
  const dirName = v4();
  return join(process.cwd(), 'apps/core-api/temp', dirName);
};
