import {
  BaseObject,
  Circle,
  Frame,
  Rectangle,
  SpriteObject,
} from '@space-drive-visualizer/frame-renderer';
import {
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
    case RenderFrameObjectType.Player:
      return mapPlayerToSpriteObject(object);
    case RenderFrameObjectType.Enemy:
      return mapEnemyToSpriteObject(object);
    case RenderFrameObjectType.Bullet:
      return mapBulletToCircle(object);
    case RenderFrameObjectType.Barrier:
      return mapBarrierToSpriteObject(object);
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
    spriteName: SpriteName.SpaceshipGreen,
  });
}

function mapEnemyToSpriteObject(object: RenderFrameObject): SpriteObject {
  return new SpriteObject({
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    spriteName: SpriteName.SpaceshipOrange,
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
    spriteName: SpriteName.AsteroidLeft,
  });
}
