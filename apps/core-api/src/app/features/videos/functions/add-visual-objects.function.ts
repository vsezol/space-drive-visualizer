import { v4 } from 'uuid';
import {
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
} from '../contracts/request/render-video-request.contract';
import { calcCircleX } from './calc-circle-x.function';
import { calcCircleY } from './calc-circle-y.function';
import { isSpaceshipMeta } from './is-spaceship-meta.function';

const LAST_FRAMES_COUNT = 27;

export function addVisualObjects(frames: RenderFrame[]): RenderFrame[] {
  const spaceshipsIds = findObjectIdsByType(
    frames,
    RenderFrameObjectType.Spaceship
  );

  const bulletsIds = findObjectIdsByType(frames, RenderFrameObjectType.Bullet);

  const lastSpaceships: SizedMap<RenderFrameObject> = new SizedMap(
    LAST_FRAMES_COUNT
  );
  const lastBullets: SizedMap<RenderFrameObject> = new SizedMap(
    LAST_FRAMES_COUNT
  );

  if (spaceshipsIds.size < 0) {
    return frames;
  }

  return frames.map((frame) => {
    return {
      objects: frame.objects.flatMap((object) => {
        if (spaceshipsIds.has(object.id)) {
          lastSpaceships.add(object.id, object);

          const flames = createFlamesForObjects(
            lastSpaceships.get(object.id),
            LAST_FRAMES_COUNT
          );

          return [...flames, object];
        }

        if (bulletsIds.has(object.id)) {
          lastBullets.add(object.id, object);

          return [createBulletHighlight(object), object];
        }

        return object;
      }),
    };
  });
}

function createFlamesForObjects(
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
  if (!isSpaceshipMeta(target.meta)) {
    return;
  }

  const originalSize = target.width / 12;
  const size = originalSize * sizeFactor;

  const distance = target.width / 2 - originalSize;

  // TODO move 90 some there
  const angle = target.rotation + 90;

  const withVariance = (x: number) => x + Math.random() * originalSize;

  return {
    id: v4(),
    x: calcCircleX(target.x, withVariance(distance), angle),
    y: calcCircleY(target.y, withVariance(distance), angle),
    width: size,
    height: size,
    rotation: 0,
    type: RenderFrameObjectType.Flame,
    meta: {
      opacity: Math.pow(sizeFactor, 3),
      color: target.meta.color,
    },
  };
}

function createBulletHighlight(target: RenderFrameObject): RenderFrameObject {
  const size = target.width * 2;

  return {
    id: v4(),
    x: target.x,
    y: target.y,
    width: size,
    height: size,
    rotation: target.rotation,
    type: RenderFrameObjectType.Highlight,
  };
}

function findObjectIdsByType(
  frames: RenderFrame[],
  type: RenderFrameObjectType
): Set<string> {
  const ids: Set<string> = new Set();

  for (const frame of frames) {
    for (const object of frame.objects) {
      if (object?.type === type && !ids.has(object.id)) {
        ids.add(object.id);
      }
    }
  }

  return ids;
}

class SizedMap<T> {
  private readonly objectById: Map<string, T[]> = new Map([]);

  constructor(private readonly size: number) {}

  get(id: string): T[] {
    return this.objectById.get(id) ?? [];
  }

  add(id: string, object: T): void {
    this.objectById.set(id, [...this.get(id), object].slice(-this.size));
  }
}
