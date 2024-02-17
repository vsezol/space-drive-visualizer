import { getUuid } from '@space-drive-visualizer/utils';
import { join } from 'path';

export const getLocalPath = (path: string = ''): string =>
  join(process.cwd(), 'apps/core-api/', path);

export const getAssetsDirPath = (): string => getLocalPath('src/assets');

export const getUniqTempDirPath = (): string => {
  const dirName = getUuid();
  return join(process.cwd(), 'apps/core-api/temp', dirName);
};
