import { Injectable } from '@nestjs/common';

import {
  BaseObject,
  Circle,
  Frame,
  Highlight,
  SpriteObject,
} from '@space-drive-visualizer/frame-renderer';
import { stringifyRGB, stringifyRGBA } from '@space-drive-visualizer/utils';
import {
  PreprocessorBarrierDto,
  PreprocessorBulletDto,
  PreprocessorFlameDto,
  PreprocessorFrameDto,
  PreprocessorHighlightDto,
  PreprocessorObjectDto,
  PreprocessorSpaceshipDto,
} from './contracts/preprocessor.dto';
import { SpriteName } from './contracts/sprite-name';

@Injectable()
export class RenderRequestMapperService {
  toRendererFrame(from: PreprocessorFrameDto, index: number): Frame {
    return {
      objects: from.objects.map((obj) => this.toRendererBaseObject(obj, index)),
    };
  }

  private toRendererBaseObject(
    from: PreprocessorObjectDto,
    frameIndex: number
  ): BaseObject {
    if (from instanceof PreprocessorSpaceshipDto) {
      return this.mapSpaceshipToSprite(from, frameIndex);
    }

    if (from instanceof PreprocessorBulletDto) {
      return this.mapBulletToCircle(from);
    }

    if (from instanceof PreprocessorBarrierDto) {
      return this.mapBarrierToSprite(from, frameIndex);
    }

    if (from instanceof PreprocessorFlameDto) {
      return this.mapFlameToCircle(from);
    }

    if (from instanceof PreprocessorHighlightDto) {
      return this.mapHighlightToHighlight(from);
    }
  }

  private mapSpaceshipToSprite(
    from: PreprocessorSpaceshipDto,
    frameIndex: number
  ): SpriteObject {
    return new SpriteObject({
      x: from.x,
      y: from.y,
      width: from.width,
      height: from.height,
      rotation: from.rotation,
      spriteName: SpriteName.Spaceship,
      frameIndex,
    });
  }

  private mapBulletToCircle(from: PreprocessorBulletDto): Circle {
    return new Circle({
      x: from.x,
      y: from.y,
      radius: from.radius,
      color: stringifyRGB(from.color),
    });
  }

  private mapBarrierToSprite(
    from: PreprocessorBarrierDto,
    frameIndex: number
  ): SpriteObject {
    return new SpriteObject({
      x: from.x,
      y: from.y,
      width: from.width,
      height: from.height,
      rotation: 0,
      spriteName: SpriteName.BarrierLeft,
      frameIndex,
    });
  }

  private mapFlameToCircle(from: PreprocessorFlameDto): Circle {
    const alpha = Number((0.6 + Math.random() * 0.4).toFixed(2));

    const [red, green, blue, opacity] = from.color;
    const color = `rgba(${red}, ${green}, ${blue}, ${alpha * opacity})`;

    return new Circle({
      x: from.x,
      y: from.y,
      radius: from.radius,
      color,
    });
  }

  private mapHighlightToHighlight(object: PreprocessorHighlightDto): Highlight {
    return new Highlight({
      x: object.x,
      y: object.y,
      radius: object.radius,
      color: stringifyRGBA(object.color),
    });
  }
}
