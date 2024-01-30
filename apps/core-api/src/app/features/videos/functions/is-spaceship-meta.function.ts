import { SpaceshipMeta } from '../contracts/request/render-video-request.contract';

export function isSpaceshipMeta(
  data: object | undefined | null
): data is SpaceshipMeta {
  const keys: (keyof SpaceshipMeta)[] = ['color'];

  return Boolean(data) && keys.every((key) => key in data);
}
