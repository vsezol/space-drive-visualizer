import { Image } from 'canvas';

export interface Sprite {
  source: Image;
  gap: number;
  rows: number;
  columns: number;
  offset: SpriteOffset;
  segment: SpriteSegment;
}

export interface SpriteOffset {
  rows: number;
  columns: number;
}

export interface SpriteSegment {
  width: number;
  height: number;
}
