import { BaseObject } from './abstract/base-object.abstract';

export class Highlight extends BaseObject {
  readonly radius: number;
  readonly rotation: number;
  readonly color: string;

  constructor({ x, y, radius, color, rotation }: Highlight) {
    super({ x, y });

    this.radius = radius;
    this.color = color;
    this.rotation = rotation;
  }
}
