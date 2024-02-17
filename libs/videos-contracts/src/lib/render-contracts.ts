import { ColorRGB, ColorRGBA } from '@space-drive-visualizer/utils';

export interface RenderRequest {
  scene: Scene;
  frames: Frame[];
  frameRate: number;
}

export interface Scene {
  width: number;
  height: number;
}

export interface Frame {
  objects: BaseObject[];
}

export interface BaseObject {
  id: string;
  x: number;
  y: number;
  type: ObjectType;
}

export interface Spaceship extends BaseObject {
  rotation: number;
  width: number;
  height: number;
  color: ColorRGB;
}

export interface Bullet extends BaseObject {
  radius: number;
  color: ColorRGB;
}

export interface Barrier extends BaseObject {
  width: number;
  height: number;
}

export interface Flame extends BaseObject {
  radius: number;
  color: ColorRGBA;
}

export interface Highlight extends BaseObject {
  radius: number;
  color: ColorRGBA;
}

export enum ObjectType {
  Spaceship = 'spaceship',
  Bullet = 'bullet',
  Barrier = 'barrier',
  Flame = 'flame',
  Highlight = 'highlight',
}
