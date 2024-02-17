import { Sprite } from '@space-drive-visualizer/sprite';
import { BaseObject } from './objects/abstract/base-object';

export interface FrameRendererOptions {
  width: number;
  height: number;
  sprites: Record<string, Sprite>;
}

export interface Frame {
  objects: BaseObject[];
}
