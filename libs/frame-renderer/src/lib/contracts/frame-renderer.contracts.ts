import { Sprite } from '@space-drive-visualizer/sprite';
import { BaseObject } from '../classes/abstract/base-object.abstract';

export interface FrameRendererOptions {
  width: number;
  height: number;
  frameIndex: number;
  sprites: Record<string, Sprite>;
}

export interface Frame {
  objects: BaseObject[];
}
