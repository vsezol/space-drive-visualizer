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
}

export interface Spaceship extends BaseObject {
  rotation: number;
  width: number;
  height: number;
  color: ColorRGB;
  type: ObjectType.Spaceship;
}

export interface Bullet extends BaseObject {
  radius: number;
  color: ColorRGB;
  type: ObjectType.Bullet;
}

export interface Barrier extends BaseObject {
  width: number;
  height: number;
  type: ObjectType.Barrier;
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
}
