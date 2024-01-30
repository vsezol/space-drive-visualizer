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
  objects: RenderFrameObject[];
}

export interface RenderFrameObject {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  type: RenderFrameObjectType;
  meta?: object;
}

export interface FlameMeta {
  color: [number, number, number];
  opacity: number;
}

export interface SpaceshipMeta {
  color: [number, number, number];
}

export enum RenderFrameObjectType {
  Spaceship = 'spaceship',
  Bullet = 'bullet',
  Barrier = 'barrier',
  Flame = 'flame',
  Highlight = 'highlight',
}
