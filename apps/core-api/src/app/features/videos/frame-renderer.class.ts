import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import { Readable } from 'stream';

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

  render(color: string): Readable {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.options.width, this.options.height);

    return this.canvas.createPNGStream();
  }
}
