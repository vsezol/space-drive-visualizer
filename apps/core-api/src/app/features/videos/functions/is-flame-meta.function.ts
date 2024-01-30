import { FlameMeta } from '../contracts/request/render-video-request.contract';

export function isFlameMeta(
  data: object | undefined | null
): data is FlameMeta {
  const keys: (keyof FlameMeta)[] = ['color', 'opacity'];

  return Boolean(data) && keys.every((key) => key in data);
}
