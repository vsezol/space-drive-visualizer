import { Canvas, CanvasRenderingContext2D, createCanvas, Image } from 'canvas';
import { Readable } from 'stream';
import {
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
} from './contracts/request/render-video-request.contract';
import { SpriteCalculator } from './sprite-calculator.class';

export interface VisualizerOptions {
  width: number;
  height: number;
}

export class FrameRenderer {
  private readonly canvas: Canvas;
  private readonly context: CanvasRenderingContext2D;

  constructor(
    private readonly options: VisualizerOptions,
    private readonly spriteImage: Image,
    private readonly frameIndex: number
  ) {
    this.canvas = createCanvas(options.width, options.height);
    this.context = this.canvas.getContext('2d');
  }

  render(frame: RenderFrame): Readable {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.options.width, this.options.height);

    frame.objects.forEach((item) => {
      switch (item.type) {
        case RenderFrameObjectType.Player:
          return this.drawPlayer(item);
        case RenderFrameObjectType.Enemy:
          return this.drawEnemy(item);
        case RenderFrameObjectType.Barrier:
          return this.drawBarrier(item);
        case RenderFrameObjectType.Bullet:
          return this.drawBullet(item);
      }
    });

    return this.canvas.createPNGStream();
  }

  private drawPlayer(object: RenderFrameObject): void {
    this.drawRect(object, 'green');
  }

  private drawEnemy(object: RenderFrameObject): void {
    this.drawRect(object, 'red');
  }

  private drawBarrier(object: RenderFrameObject): void {
    this.drawSprite(object, this.spriteImage);
  }

  private drawBullet(object: RenderFrameObject): void {
    this.drawCircle(object, 'purple');
  }

  private drawRect(
    { x, y, width, height, rotation }: RenderFrameObject,
    color: string
  ) {
    this.context.save();

    this.context.beginPath();

    // move the rotation point to the center of the rect
    this.context.translate(x + width / 2, y + height / 2);

    this.context.rotate((rotation * Math.PI) / 180);

    this.context.rect(-width / 2, -height / 2, width, height);

    this.context.fillStyle = color;
    this.context.fill();

    this.context.restore();
  }

  private drawSprite({ x, y, width, height }: RenderFrameObject, image: Image) {
    const spriteRenderer = new SpriteCalculator({
      image: {
        height: 128,
        width: 128,
      },
      gap: 10,
      rows: 8,
      columns: 8,
    });

    const index = Math.trunc(this.frameIndex / 2);

    const { source, target } = spriteRenderer.calcDrawImageOptions({
      index,
      x,
      y,
      width,
      height,
    });

    this.context.imageSmoothingEnabled = true;
    this.context.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      target.x,
      target.y,
      target.width,
      target.height
    );
  }

  private drawCircle({ x, y, width }: RenderFrameObject, color: string) {
    const radius = width / 2;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
  }
}
