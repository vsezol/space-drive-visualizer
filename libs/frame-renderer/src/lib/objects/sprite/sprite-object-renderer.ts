import { Sprite } from '@space-drive-visualizer/sprite';
import { CanvasRenderingContext2D } from 'canvas';
import { ObjectRenderer } from '../abstract/object-renderer';
import { SpriteObject } from './sprite-object';

interface OutputImageOptions {
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

export class SpriteObjectRenderer extends ObjectRenderer<SpriteObject> {
  constructor(
    context: CanvasRenderingContext2D,
    object: SpriteObject,
    private readonly sprite: Sprite
  ) {
    super(context, object);
  }

  override render(): void {
    const index = Math.trunc(this.object.frameIndex / 2);

    const { source, target } = this.calcDrawImageOptions({
      index,
      x: this.object.x,
      y: this.object.y,
      width: this.object.width,
      height: this.object.height,
    });

    this.context.save();

    this.context.translate(target.x, target.y);
    this.context.rotate((this.object.rotation * Math.PI) / 180);

    this.context.imageSmoothingEnabled = true;
    this.context.drawImage(
      this.sprite.source,
      source.x,
      source.y,
      source.width,
      source.height,
      -target.width / 2,
      -target.height / 2,
      target.width,
      target.height
    );

    this.context.restore();
  }

  private calcDrawImageOptions(output: OutputImageOptions): DrawImageOptions {
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
