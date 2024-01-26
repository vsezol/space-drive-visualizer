import {
  DrawImageOptions,
  OutputImageOptions,
} from '../contracts/sprite-calculator.contracts';
import { Sprite } from '../contracts/sprite.contracts';

export class SpriteCalculator {
  constructor(private readonly sprite: Sprite) {}

  calcDrawImageOptions(output: OutputImageOptions): DrawImageOptions {
    const cellsCount = this.sprite.rows * this.sprite.columns;

    const index = output.index % cellsCount;
    const row = Math.trunc(index / this.sprite.columns);
    const column = index - row * this.sprite.columns;

    const globalColumn = column + this.sprite.offset.columns;
    const globalRow = row + this.sprite.offset.rows;

    const segment = this.sprite.segment;
    const gap = this.sprite.gap;

    return {
      source: {
        x: globalColumn * segment.width + gap,
        y: globalRow * segment.height + gap,
        width: segment.width - gap,
        height: segment.height - gap,
      },
      target: {
        x: output.x,
        y: output.y,
        width: output.width,
        height: output.height,
      },
    };
  }
}
