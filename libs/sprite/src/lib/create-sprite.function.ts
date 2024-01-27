import { Sprite } from './sprite.contracts';

type Options = Omit<Sprite, 'offset'> & Partial<Pick<Sprite, 'offset'>>;

export function createSprite(options: Options): Sprite {
  return {
    source: options.source,
    gap: options.gap,
    segment: options.segment,
    rows: options.rows,
    columns: options.columns,
    offset: options.offset ?? { rows: 0, columns: 0 },
  };
}
