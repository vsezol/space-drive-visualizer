import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { Readable } from 'stream';
import {
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
} from './contracts/request/render-video-request.contract';

export interface VisualizerOptions {
  width: number;
  height: number;
}

export class FrameRenderer {
  private readonly canvas: Canvas;
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly options: VisualizerOptions) {
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
    this.drawCircle(object, 'white');
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

  private drawCircle({ x, y, width }: RenderFrameObject, color: string) {
    this.context.beginPath();
    this.context.arc(x, y, width, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
  }
}
