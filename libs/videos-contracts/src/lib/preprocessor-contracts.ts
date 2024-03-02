import { ColorRGB, ColorRGBA } from '@space-drive-visualizer/utils';

export interface PreprocessorData {
  scene: PreprocessorScene;
  frames: PreprocessorFrame[];
  frameRate: number;
  players: PreprocessorPlayerInfo[];
}

export interface PreprocessorPlayerInfo {
  id: string;
  name: string;
  color: ColorRGB;
  x: number;
  y: number;
  fontSize: number;
}

export interface PreprocessorScene {
  width: number;
  height: number;
}

export interface PreprocessorFrame {
  objects: PreprocessorObject[];
}

export interface PreprocessorObject {
  id: string;
  x: number;
  y: number;
}

export interface PreprocessorSpaceship extends PreprocessorObject {
  rotation: number;
  width: number;
  height: number;
  color: ColorRGB;
  type: PreprocessorObjectType.Spaceship;
}

export interface PreprocessorBullet extends PreprocessorObject {
  radius: number;
  color: ColorRGB;
  type: PreprocessorObjectType.Bullet;
}

export interface PreprocessorBarrier extends PreprocessorObject {
  width: number;
  height: number;
  type: PreprocessorObjectType.Barrier;
}

export interface PreprocessorFlame extends PreprocessorObject {
  radius: number;
  color: ColorRGBA;
}

export interface PreprocessorHighlight extends PreprocessorObject {
  radius: number;
  color: ColorRGBA;
}

export enum PreprocessorObjectType {
  Spaceship = 'spaceship',
  Bullet = 'bullet',
  Barrier = 'barrier',
  PlayerInfo = 'player-info',
}
