import { BaseObject } from '../abstract/base-object';

export class Rectangle extends BaseObject {
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly color: string;

  constructor({ x, y, width, height, color, rotation }: Rectangle) {
    super({ x, y });

    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation = rotation;
  }
}
