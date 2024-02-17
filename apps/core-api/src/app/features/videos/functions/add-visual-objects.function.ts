import {
  calcCircleX,
  calcCircleY,
  toRadians,
} from '@space-drive-visualizer/utils';
import { RenderFrame } from '@space-drive-visualizer/videos-contracts';
import { SizedMap } from '../classes/sized-map.class';
import {
  BulletDto,
  FlameDto,
  HighlightDto,
  SpaceshipDto,
} from '../dto/render-video-request.dto';

const LAST_FRAMES_COUNT = 27;

export function addVisualObjects(frames: RenderFrame[]): RenderFrame[] {
  const lastSpaceships = new SizedMap<string, SpaceshipDto>(LAST_FRAMES_COUNT);

  return frames.map((frame, frameIndex) => {
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
          return [createBulletHighlight(object, frameIndex), object];
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

function createBulletHighlight(
  target: BulletDto,
  frameIndex: number
): HighlightDto {
  const radius = target.radius * 2;
  const alpha = 0.25 * Math.sin(10 * toRadians(frameIndex)) + 0.75;

  return HighlightDto.create({
    x: target.x,
    y: target.y,
    radius,
    color: [...target.color, alpha],
  });
}
