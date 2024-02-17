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
  BarrierDto,
  BaseObjectDto,
  BulletDto,
  FlameDto,
  FrameDto,
  HighlightDto,
  SpaceshipDto,
} from './contracts/render-request.dto';
import { SpriteName } from './contracts/sprite-name';

@Injectable()
export class RenderRequestMapperService {
  toRendererFrame(from: FrameDto, index: number): Frame {
    return {
      objects: from.objects.map((obj) => this.toRendererBaseObject(obj, index)),
    };
  }

  private toRendererBaseObject(
    from: BaseObjectDto,
    frameIndex: number
  ): BaseObject {
    if (from instanceof SpaceshipDto) {
      return this.mapSpaceshipToSprite(from, frameIndex);
    }

    if (from instanceof BulletDto) {
      return this.mapBulletToCircle(from);
    }

    if (from instanceof BarrierDto) {
      return this.mapBarrierToSprite(from, frameIndex);
    }

    if (from instanceof FlameDto) {
      return this.mapFlameToCircle(from);
    }

    if (from instanceof HighlightDto) {
      return this.mapHighlightToHighlight(from);
    }
  }

  private mapSpaceshipToSprite(
    from: SpaceshipDto,
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

  private mapBulletToCircle(from: BulletDto): Circle {
    return new Circle({
      x: from.x,
      y: from.y,
      radius: from.radius,
      color: stringifyRGB(from.color),
    });
  }

  private mapBarrierToSprite(
    from: BarrierDto,
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

  private mapFlameToCircle(from: FlameDto): Circle {
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

  private mapHighlightToHighlight(object: HighlightDto): Highlight {
    return new Highlight({
      x: object.x,
      y: object.y,
      radius: object.radius,
      color: stringifyRGBA(object.color),
    });
  }
}
