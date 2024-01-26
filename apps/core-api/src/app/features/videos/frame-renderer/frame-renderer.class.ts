import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { Readable } from 'stream';
import { CircleRenderer } from './classes/circle-renderer.class';
import { Circle } from './classes/circle.class';
import { RectangleRenderer } from './classes/rectangle-renderer.class';
import { Rectangle } from './classes/rectangle.class';
import { SpriteObjectRenderer } from './classes/sprite-object-renderer.class';
import { SpriteObject } from './classes/sprite-object.class';
import {
  Frame,
  FrameRendererOptions,
} from './contracts/frame-renderer.contracts';

export class FrameRenderer {
  private readonly canvas: Canvas;
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly options: FrameRendererOptions) {
    this.canvas = createCanvas(options.width, options.height);
    this.context = this.canvas.getContext('2d');
  }

  render(frame: Frame): Readable {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.options.width, this.options.height);

    // TODO Move to factory
    frame.objects
      .map((object) => {
        if (object instanceof Rectangle) {
          return new RectangleRenderer(this.context, object);
        }

        if (object instanceof Circle) {
          return new CircleRenderer(this.context, object);
        }

        if (object instanceof SpriteObject) {
          return new SpriteObjectRenderer(
            this.context,
            object,
            this.options.sprites[object.spriteName],
            this.options.frameIndex
          );
        }

        throw new Error(`[FrameRenderer] Renderer for object not found!`);
      })
      .forEach((renderer) => renderer.render());

    return this.canvas.createJPEGStream({ quality: 1 });
  }
}
