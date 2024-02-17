import { BaseObject } from '../abstract/base-object';

export class Highlight extends BaseObject {
  readonly radius: number;
  readonly color: string;

  constructor({ x, y, radius, color }: Highlight) {
    super({ x, y });

    this.radius = radius;
    this.color = color;
  }
}
