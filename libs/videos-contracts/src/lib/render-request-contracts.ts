export interface RenderRequest {
  map: RenderRequestMap;
  history: RenderRequestHistoryItem[];
  players: RenderRequestPlayerInfo[];
}

export interface RenderRequestMap {
  width: number;
  height: number;
  seed: number;
  barriers: RenderRequestBarrier[];
}

export interface RenderRequestBarrier {
  x: number;
  y: number;
  r: number;
}

export interface RenderRequestHistoryItem {
  time: number;
  objects: RenderRequestObject[];
}

export interface RenderRequestObject {
  object: RenderRequestObjectType;
  id: number;
  x: number;
  y: number;
  direction: number;
}

export interface RenderRequestPlayer extends RenderRequestObject {
  object: RenderRequestObjectType.Player;
  r: number;
}

export interface RenderRequestMissile extends RenderRequestObject {
  object: RenderRequestObjectType.Missile;
}

export enum RenderRequestObjectType {
  Player = 'player',
  Missile = 'missile',
}

export interface RenderRequestPlayerInfo {
  id: number;
  ip: string;
  name: string;
}
