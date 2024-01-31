import { BaseObject } from './abstract/base-object.abstract';

export class SpriteObject extends BaseObject {
  readonly width: number;
  readonly height: number;
  readonly spriteName: string;
  readonly rotation: number;
  readonly frameIndex: number;

  constructor({
    x,
    y,
    width,
    height,
    spriteName,
    rotation,
    frameIndex,
  }: SpriteObject) {
    super({ x, y });

    this.width = width;
    this.height = height;
    this.spriteName = spriteName;
    this.rotation = rotation;
    this.frameIndex = frameIndex;
  }
}
