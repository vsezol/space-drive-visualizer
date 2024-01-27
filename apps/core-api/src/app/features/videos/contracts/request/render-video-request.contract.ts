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
}

export enum RenderFrameObjectType {
  Player = 'player',
  Enemy = 'enemy',
  Bullet = 'bullet',
  Barrier = 'barrier',
}
