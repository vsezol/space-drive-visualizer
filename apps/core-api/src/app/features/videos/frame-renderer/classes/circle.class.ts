import { BaseObject } from './abstract/base-object.abstract';

export class Circle extends BaseObject {
  readonly radius: number;
  readonly color: string;

  constructor({ x, y, radius, color }: Circle) {
    super({ x, y });

    this.radius = radius;
    this.color = color;
  }
}
