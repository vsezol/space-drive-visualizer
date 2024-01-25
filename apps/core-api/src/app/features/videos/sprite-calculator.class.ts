export interface SpriteCalculatorOptions {
  image: SpriteImageOptions;
  rows: number;
  columns: number;
  gap: number;
  offset?: SpriteOffset;
}

export interface SpriteOffset {
  rows: number;
  columns: number;
}

export interface SpriteImageOptions {
  width: number;
  height: number;
}

export interface OutputImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

interface DrawImageOptions {
  source: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  target: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class SpriteCalculator {
  private readonly image: SpriteImageOptions;
  private readonly gap: number;
  private readonly rows: number;
  private readonly columns: number;
  private readonly offset: SpriteOffset;

  constructor(options: SpriteCalculatorOptions) {
    this.image = options.image;
    this.gap = options.gap;
    this.rows = options.rows;
    this.columns = options.columns;
    this.offset = options?.offset ?? { rows: 0, columns: 0 };
  }

  calcDrawImageOptions(output: OutputImageOptions): DrawImageOptions {
    const cellsCount = this.rows * this.columns;

    const index = output.index % cellsCount;
    const row = Math.trunc(index / this.columns);
    const column = index - row * this.columns;

    const globalColumn = column + this.offset.columns;
    const globalRow = row + this.offset.rows;

    const image = this.image;
    const gap = this.gap;

    return {
      source: {
        x: globalColumn * image.width + gap,
        y: globalRow * image.height + gap,
        width: image.width - gap,
        height: image.height - gap,
      },
      target: {
        x: output.x - output.width / 2,
        y: output.y - output.height / 2,
        width: output.width,
        height: output.height,
      },
    };
  }
}
