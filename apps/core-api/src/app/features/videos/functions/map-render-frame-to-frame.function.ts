import {
  BaseObject,
  Circle,
  Frame,
  Highlight,
  SpriteObject,
} from '@space-drive-visualizer/frame-renderer';
import {
  Barrier,
  Bullet,
  Flame,
  RenderFrame,
  RenderObject,
} from '@space-drive-visualizer/videos-contracts';
import { SpriteName } from '../contracts/sprite-name.enum';
import {
  BarrierDto,
  BulletDto,
  FlameDto,
  HighlightDto,
  SpaceshipDto,
} from '../dto/render-video-request.dto';

export function mapRenderFrameToFrame(frame: RenderFrame): Frame {
  return {
    objects: frame.objects.map(mapRenderFrameObjectToBaseObject),
  };
}

function mapRenderFrameObjectToBaseObject(object: RenderObject): BaseObject {
  if (object instanceof SpaceshipDto) {
    return mapSpaceshipToSpriteObject(object);
  }

  if (object instanceof BulletDto) {
    return mapBulletToCircle(object);
  }

  if (object instanceof BarrierDto) {
    return mapBarrierToSpriteObject(object);
  }

  if (object instanceof FlameDto) {
    return mapFlameToCircleObject(object);
  }

  if (object instanceof HighlightDto) {
    return mapHighlightToHighlight(object);
  }
}

function mapSpaceshipToSpriteObject(object: SpaceshipDto): SpriteObject {
  return new SpriteObject({
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    spriteName: SpriteName.Spaceship,
  });
}

function mapFlameToCircleObject(object: Flame): Circle {
  const alpha = Number((0.6 + Math.random() * 0.4).toFixed(2));

  const [red, green, blue, opacity] = object.color;
  const color = `rgba(${red}, ${green}, ${blue}, ${alpha * opacity})`;

  return new Circle({
    x: object.x,
    y: object.y,
    radius: object.radius,
    color,
  });
}

function mapBulletToCircle(object: Bullet): Circle {
  return new Circle({
    x: object.x,
    y: object.y,
    radius: object.radius,
    color: 'purple',
  });
}

function mapHighlightToHighlight(object: HighlightDto): Highlight {
  return new Highlight({
    x: object.x,
    y: object.y,
    radius: object.radius,
    color: 'green',
  });
}

function mapBarrierToSpriteObject(object: Barrier): SpriteObject {
  return new SpriteObject({
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: 0,
    spriteName: SpriteName.BarrierLeft,
  });
}
