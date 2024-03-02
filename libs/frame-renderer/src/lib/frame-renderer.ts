import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { Readable } from 'stream';
import { Frame, FrameRendererOptions } from './contracts';
import { Circle } from './objects/circle/circle';
import { CircleRenderer } from './objects/circle/circle-renderer';
import { Highlight } from './objects/highlight/highlight';
import { HighlightRenderer } from './objects/highlight/highlight-renderer';
import { Label } from './objects/label/label';
import { LabelRenderer } from './objects/label/label-renderer';
import { Rectangle } from './objects/rectangle/rectangle';
import { RectangleRenderer } from './objects/rectangle/rectangle-renderer';
import { SpriteObject } from './objects/sprite/sprite-object';
import { SpriteObjectRenderer } from './objects/sprite/sprite-object-renderer';

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
            this.options.sprites[object.spriteName]
          );
        }

        if (object instanceof Highlight) {
          return new HighlightRenderer(this.context, object);
        }

        if (object instanceof Label) {
          return new LabelRenderer(this.context, object);
        }

        throw new Error(`[FrameRenderer] Renderer for object not found!`);
      })
      .forEach((renderer) => renderer.render());

    return this.canvas.createJPEGStream({ quality: 1 });
  }
}
