import { Injectable } from '@nestjs/common';
import {
  ColorRGB,
  SizedMap,
  calcCircleX,
  calcCircleY,
  getRandomRGB,
  toRadians,
} from '@space-drive-visualizer/utils';
import {
  PreprocessorBulletDto,
  PreprocessorDataDto,
  PreprocessorFlameDto,
  PreprocessorFrameDto,
  PreprocessorHighlightDto,
  PreprocessorPlayerInfoDto,
  PreprocessorSpaceshipDto,
} from './contracts/preprocessor.dto';

const LAST_FRAMES_COUNT = 27;

@Injectable()
export class FramesPreprocessingService {
  preprocess(data: PreprocessorDataDto): PreprocessorDataDto {
    return this.addPlayersTable(this.addVisualObjects(data));
  }

  private addPlayersTable({
    frames,
    frameRate,
    scene,
    players,
  }: PreprocessorDataDto): PreprocessorDataDto {
    const fontSize = 20;
    const yGap = fontSize;
    const xGap = 5 + 0;

    const positions: [number, number][] = [];

    let rowsCount = 1;
    let lastX = 0;
    let i = 0;

    while (i < players.length) {
      const x = lastX + xGap;
      const y = scene.height + rowsCount * (fontSize + yGap);
      const labelWidth = players[i].name.length * fontSize;

      if (x + labelWidth + xGap > scene.width) {
        rowsCount++;
        lastX = 0;
        continue;
      }

      i++;
      lastX += labelWidth + xGap;
      positions.push([x, y]);
    }

    const tableHeight = rowsCount * (fontSize + yGap) + yGap;

    const playersTable = players.map(({ color, name, id }, index) => {
      const [x, y] = positions[index];

      const player = PreprocessorPlayerInfoDto.create({
        x,
        y,
        fontSize,
        color,
        name,
        id,
      });

      return player;
    });

    const updatedFrames = frames.map((frame) =>
      PreprocessorFrameDto.create({
        objects: [...frame.objects, ...playersTable],
      })
    );

    return {
      frameRate,
      frames: updatedFrames,
      scene: {
        width: scene.width,
        height: scene.height + tableHeight,
      },
      players,
    };
  }

  private addVisualObjects({
    frames,
    frameRate,
    scene,
    players,
  }: PreprocessorDataDto): PreprocessorDataDto {
    const lastSpaceships = new SizedMap<string, PreprocessorSpaceshipDto>(
      LAST_FRAMES_COUNT
    );
    const colorById = new Map<string, ColorRGB>();

    const updatedFrames = frames.map((frame, frameIndex) => {
      return {
        objects: frame.objects.flatMap((object) => {
          if (object instanceof PreprocessorBulletDto) {
            return [this.createBulletHighlight(object, frameIndex), object];
          }

          if (object instanceof PreprocessorSpaceshipDto) {
            let color = colorById.get(object.id);
            if (!color) {
              color = getRandomRGB();
              colorById.set(object.id, color);
            }
            object.color = color;

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

    const updatedPlayers = players.map(({ id, name, color, x, y, fontSize }) =>
      PreprocessorPlayerInfoDto.create({
        id,
        name,
        x,
        y,
        fontSize,
        color: colorById.get(id) || color,
      })
    );

    return {
      frames: updatedFrames,
      players: updatedPlayers,
      frameRate,
      scene,
    };
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
