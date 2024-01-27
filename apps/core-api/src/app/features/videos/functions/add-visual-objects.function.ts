import { v4 } from 'uuid';
import {
  FlameMeta,
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
} from '../contracts/request/render-video-request.contract';

export function addVisualObjects(frames: RenderFrame[]): RenderFrame[] {
  const player = findFirstObjectByType(frames, RenderFrameObjectType.Player);
  const enemy = findFirstObjectByType(frames, RenderFrameObjectType.Enemy);

  if (player === undefined || enemy === undefined) {
    return frames;
  }

  let playerLast: RenderFrameObject[] = [];
  let enemyLast: RenderFrameObject[] = [];
  const lastFramesCount = 27;

  return frames.map((frame) => {
    return {
      objects: frame.objects.flatMap((object) => {
        if (object.id === player.id) {
          playerLast = [...playerLast, object].slice(-lastFramesCount);

          return [
            ...createFlamesByLastObjects(playerLast, lastFramesCount),
            object,
          ];
        }

        if (object.id === enemy.id) {
          enemyLast = [...enemyLast, object].slice(-lastFramesCount);

          return [
            ...createFlamesByLastObjects(enemyLast, lastFramesCount),
            object,
          ];
        }

        return object;
      }),
    };
  });
}

function createFlamesByLastObjects(
  lastObjects: RenderFrameObject[],
  size: number
): RenderFrameObject[] {
  return lastObjects.map((object, index) =>
    createFlame(object, index / size + 0)
  );
}

function createFlame(
  target: RenderFrameObject,
  sizeFactor: number
): RenderFrameObject {
  const meta: FlameMeta = {
    target: {
      type: target.type,
    },
    opacity: Math.pow(sizeFactor, 3),
  };

  const originalSize = target.width / 12;

  const width = originalSize * sizeFactor;
  const height = originalSize * sizeFactor;

  const distance = target.width / 2 - originalSize;

  const rotation = target.rotation + 90 + 0;

  const x =
    target.x +
    (distance + Math.random() * originalSize) *
      Math.cos((rotation * Math.PI) / 180);
  const y =
    target.y +
    (distance + Math.random() * originalSize) *
      Math.sin((rotation * Math.PI) / 180);

  return {
    id: v4(),
    x: x,
    y: y,
    width,
    height,
    rotation: 0,
    type: RenderFrameObjectType.Flame,
    meta,
  };
}

function findFirstObjectByType(
  frames: RenderFrame[],
  type: RenderFrameObjectType
): RenderFrameObject | undefined {
  for (const frame of frames) {
    for (const object of frame.objects) {
      if (object?.type === type) {
        return object;
      }
    }
  }
}
