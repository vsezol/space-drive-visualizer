import { Injectable } from '@nestjs/common';
import {
  SizedMap,
  calcCircleX,
  calcCircleY,
  toRadians,
} from '@space-drive-visualizer/utils';
import {
  PreprocessorBulletDto,
  PreprocessorFlameDto,
  PreprocessorFrameDto,
  PreprocessorHighlightDto,
  PreprocessorSpaceshipDto,
} from './contracts/preprocessor.dto';

const LAST_FRAMES_COUNT = 27;

@Injectable()
export class FramesPreprocessingService {
  preprocess(frames: PreprocessorFrameDto[]): PreprocessorFrameDto[] {
    return this.addVisualObjects(frames);
  }

  private addVisualObjects(
    frames: PreprocessorFrameDto[]
  ): PreprocessorFrameDto[] {
    const lastSpaceships = new SizedMap<string, PreprocessorSpaceshipDto>(
      LAST_FRAMES_COUNT
    );

    return frames.map((frame, frameIndex) => {
      return {
        objects: frame.objects.flatMap((object) => {
          if (object instanceof PreprocessorBulletDto) {
            return [this.createBulletHighlight(object, frameIndex), object];
          }

          if (object instanceof PreprocessorSpaceshipDto) {
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
    lastObjects: PreprocessorSpaceshipDto[],
    size: number
  ): PreprocessorFlameDto[] {
    return lastObjects.map((object, index) =>
      this.createSpaceshipFlame(object, index / size + 0)
    );
  }

  private createSpaceshipFlame(
    target: PreprocessorSpaceshipDto,
    sizeFactor: number
  ): PreprocessorFlameDto {
    const originalSize = target.width / 12;
    const size = originalSize * sizeFactor;

    const distance = target.width / 2 - originalSize;

    // TODO move 90 some there
    const angle = target.rotation + 90;

    const withVariance = (x: number) => x + Math.random() * originalSize;

    return PreprocessorFlameDto.create({
      x: calcCircleX(target.x, withVariance(distance), angle),
      y: calcCircleY(target.y, withVariance(distance), angle),
      radius: size,
      color: [...target.color, Math.pow(sizeFactor, 3)],
    });
  }

  private createBulletHighlight(
    target: PreprocessorBulletDto,
    frameIndex: number
  ): PreprocessorHighlightDto {
    const radius = target.radius * 2;
    const alpha = 0.25 * Math.sin(10 * toRadians(frameIndex)) + 0.75;

    return PreprocessorHighlightDto.create({
      x: target.x,
      y: target.y,
      radius,
      color: [...target.color, alpha],
    });
  }
}
