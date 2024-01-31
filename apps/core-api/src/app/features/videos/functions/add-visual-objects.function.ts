import {
  RenderFrame,
  RenderObject,
} from '@space-drive-visualizer/videos-contracts';
import {
  BulletDto,
  FlameDto,
  HighlightDto,
  SpaceshipDto,
} from '../dto/render-video-request.dto';
import { calcCircleX } from './calc-circle-x.function';
import { calcCircleY } from './calc-circle-y.function';

const LAST_FRAMES_COUNT = 27;

export function addVisualObjects(frames: RenderFrame[]): RenderFrame[] {
  const lastSpaceships: SizedMap<SpaceshipDto> = new SizedMap(
    LAST_FRAMES_COUNT
  );
  const lastBullets: SizedMap<RenderObject> = new SizedMap(LAST_FRAMES_COUNT);

  return frames.map((frame) => {
    return {
      objects: frame.objects.flatMap((object) => {
        if (object instanceof SpaceshipDto) {
          lastSpaceships.add(object.id, object);

          const flames = createFlamesForSpaceships(
            lastSpaceships.get(object.id),
            LAST_FRAMES_COUNT
          );

          return [...flames, object];
        }

        if (object instanceof BulletDto) {
          lastBullets.add(object.id, object);

          return [createBulletHighlight(object), object];
        }

        return object;
      }),
    };
  });
}

function createFlamesForSpaceships(
  lastObjects: SpaceshipDto[],
  size: number
): FlameDto[] {
  return lastObjects.map((object, index) =>
    createSpaceshipFlame(object, index / size + 0)
  );
}

function createSpaceshipFlame(
  target: SpaceshipDto,
  sizeFactor: number
): FlameDto {
  const originalSize = target.width / 12;
  const size = originalSize * sizeFactor;

  const distance = target.width / 2 - originalSize;

  // TODO move 90 some there
  const angle = target.rotation + 90;

  const withVariance = (x: number) => x + Math.random() * originalSize;

  return FlameDto.create({
    x: calcCircleX(target.x, withVariance(distance), angle),
    y: calcCircleY(target.y, withVariance(distance), angle),
    radius: size,
    color: [...target.color, Math.pow(sizeFactor, 3)],
  });
}

function createBulletHighlight(target: BulletDto): HighlightDto {
  const size = target.radius * 2;

  return HighlightDto.create({
    x: target.x,
    y: target.y,
    radius: size,
    color: [...target.color, 1.0],
  });
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

// function findObjectIdsByType(
//   frames: RenderFrame[],
//   type: RenderObjectType
// ): Set<string> {
//   const ids: Set<string> = new Set();

//   for (const frame of frames) {
//     for (const object of frame.objects) {
//       if (object?.type === type && !ids.has(object.id)) {
//         ids.add(object.id);
//       }
//     }
//   }

//   return ids;
// }
