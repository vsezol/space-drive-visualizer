import { CanvasRenderingContext2D } from 'canvas';
import { BaseObject } from './base-object.abstract';

export abstract class ObjectRenderer<T extends BaseObject> {
  constructor(
    protected readonly context: CanvasRenderingContext2D,
    protected readonly object: T
  ) {}

  render(): void {}
}
