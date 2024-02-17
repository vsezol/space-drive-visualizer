import { Injectable } from '@nestjs/common';
import {
  SizedMap,
  calcCircleX,
  calcCircleY,
  toRadians,
} from '@space-drive-visualizer/utils';
import {
  BulletDto,
  FlameDto,
  FrameDto,
  HighlightDto,
  SpaceshipDto,
} from './contracts/render-request.dto';

const LAST_FRAMES_COUNT = 27;

@Injectable()
export class FramesPreprocessingService {
  preprocess(frames: FrameDto[]): FrameDto[] {
    return this.addVisualObjects(frames);
  }

  private addVisualObjects(frames: FrameDto[]): FrameDto[] {
    const lastSpaceships = new SizedMap<string, SpaceshipDto>(
      LAST_FRAMES_COUNT
    );

    return frames.map((frame, frameIndex) => {
      return {
        objects: frame.objects.flatMap((object) => {
          if (object instanceof BulletDto) {
            return [this.createBulletHighlight(object, frameIndex), object];
          }

          if (object instanceof SpaceshipDto) {
            lastSpaceships.add(object.id, object);

            const flames = this.createFlamesForSpaceships(
              lastSpaceships.get(object.id),
              LAST_FRAMES_COUNT
            );

            return [...flames, object];
          }

          return object;
        }),
      };
    });
  }

  private createFlamesForSpaceships(
    lastObjects: SpaceshipDto[],
    size: number
  ): FlameDto[] {
    return lastObjects.map((object, index) =>
      this.createSpaceshipFlame(object, index / size + 0)
    );
  }

  private createSpaceshipFlame(
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

  private createBulletHighlight(
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
}
