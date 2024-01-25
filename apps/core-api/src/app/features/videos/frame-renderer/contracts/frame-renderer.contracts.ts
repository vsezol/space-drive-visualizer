import { BaseObject } from '../classes/abstract/base-object.abstract';
import { Sprite } from './sprite.contracts';

export interface FrameRendererOptions {
  width: number;
  height: number;
  frameIndex: number;
  sprites: Record<string, Sprite>;
}

export interface Frame {
  objects: BaseObject[];
}
