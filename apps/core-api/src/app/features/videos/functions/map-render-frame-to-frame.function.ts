import {
  BaseObject,
  Circle,
  Frame,
  Rectangle,
  SpriteObject,
} from '@space-drive-visualizer/frame-renderer';
import {
  FlameMeta,
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
} from '../contracts/request/render-video-request.contract';
import { SpriteName } from '../contracts/sprite-name.enum';

export function mapRenderFrameToFrame(frame: RenderFrame): Frame {
  return {
    objects: frame.objects.map(mapRenderFrameObjectToBaseObject),
  };
}

function mapRenderFrameObjectToBaseObject(
  object: RenderFrameObject
): BaseObject {
  switch (object.type) {
    case RenderFrameObjectType.Spaceship:
      return mapPlayerToSpriteObject(object);
    case RenderFrameObjectType.Bullet:
      return mapBulletToCircle(object);
    case RenderFrameObjectType.Barrier:
      return mapBarrierToSpriteObject(object);
    case RenderFrameObjectType.Flame:
      return mapFlameToCircleObject(object);
    default:
      return mapObjectToRectangle(object);
  }
}

function mapPlayerToSpriteObject(object: RenderFrameObject): SpriteObject {
  return new SpriteObject({
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    spriteName: SpriteName.Spaceship,
  });
}

function isFlameMeta(data: object | undefined | null): data is FlameMeta {
  return Boolean(data) && 'color' in data && 'opacity' in data;
}

function mapFlameToCircleObject(object: RenderFrameObject): Circle {
  const meta = object?.meta;

  let color: string = 'blue';
  const alpha = Number((0.6 + Math.random() * 0.4).toFixed(2));

  if (isFlameMeta(meta)) {
    const [red, green, blue] = meta.color;
    color = `rgba(${red}, ${green}, ${blue}, ${alpha * meta.opacity})`;
  }

  return new Circle({
    x: object.x,
    y: object.y,
    radius: object.width,
    color,
  });
}

function mapObjectToRectangle(
  object: RenderFrameObject,
  color: string = 'white'
): Rectangle {
  return new Rectangle({
    x: object.x,
    y: object.y,
    color,
    rotation: object.rotation,
    width: object.width,
    height: object.height,
  });
}

function mapBulletToCircle(object: RenderFrameObject): Circle {
  return new Circle({
    x: object.x,
    y: object.y,
    radius: object.width,
    color: 'purple',
  });
}

function mapBarrierToSpriteObject(object: RenderFrameObject): SpriteObject {
  return new SpriteObject({
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    spriteName: SpriteName.BarrierLeft,
  });
}
