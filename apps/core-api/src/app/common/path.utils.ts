import { getUuid } from '@space-drive-visualizer/utils';
import { join } from 'path';
import { environment } from '../../environments/environment';

export const getLocalPath = (path: string = ''): string =>
  join(process.cwd(), environment.rootPath, path);

export const getAssetsDirPath = (): string => getLocalPath('assets');

export const getUniqTempDirPath = (): string => {
  const dirName = getUuid();
  return getLocalPath(join('temp', dirName));
};
