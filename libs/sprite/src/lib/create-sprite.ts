import { CreateSpriteOptions, Sprite } from './sprite';

export function createSprite(options: CreateSpriteOptions): Sprite {
  return {
    source: options.source,
    gap: options.gap,
    segment: options.segment,
    rows: options.rows,
    columns: options.columns,
    offset: options.offset ?? { rows: 0, columns: 0 },
  };
}
