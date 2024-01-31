export interface RenderVideoRequest {
  scene: RenderScene;
  frames: RenderFrame[];
  frameRate: number;
}

export interface RenderScene {
  width: number;
  height: number;
}

export interface RenderFrame {
  objects: RenderObject[];
}

export interface RenderObject {
  id: string;
  x: number;
  y: number;
  type: RenderObjectType;
}

export interface Spaceship extends RenderObject {
  rotation: number;
  width: number;
  height: number;
  color: ColorRGB;
}

export interface Bullet extends RenderObject {
  radius: number;
  color: ColorRGB;
}

export interface Barrier extends RenderObject {
  width: number;
  height: number;
}

export interface Flame extends RenderObject {
  radius: number;
  color: ColorRGBA;
}

export interface Highlight extends RenderObject {
  radius: number;
  color: ColorRGBA;
}

export enum RenderObjectType {
  Spaceship = 'spaceship',
  Bullet = 'bullet',
  Barrier = 'barrier',
  Flame = 'flame',
  Highlight = 'highlight',
}

export type ColorRGB = [number, number, number];
export type ColorRGBA = [number, number, number, number];
