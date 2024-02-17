export abstract class BaseObject {
  readonly x: number;
  readonly y: number;

  constructor({ x, y }: BaseObject) {
    this.x = x;
    this.y = y;
  }
}
