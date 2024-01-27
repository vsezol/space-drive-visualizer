import { Sprite } from '@space-drive-visualizer/sprite';
import { CanvasRenderingContext2D } from 'canvas';
import { ObjectRenderer } from './abstract/object-renderer.abstract';
import { SpriteCalculator } from './sprite-calculator.class';
import { SpriteObject } from './sprite-object.class';

export class SpriteObjectRenderer extends ObjectRenderer<SpriteObject> {
  constructor(
    context: CanvasRenderingContext2D,
    object: SpriteObject,
    private readonly sprite: Sprite,
    private readonly frameIndex: number
  ) {
    super(context, object);
  }

  override render(): void {
    const spriteRenderer = new SpriteCalculator(this.sprite);

    const index = Math.trunc(this.frameIndex / 2);

    const { source, target } = spriteRenderer.calcDrawImageOptions({
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
}
