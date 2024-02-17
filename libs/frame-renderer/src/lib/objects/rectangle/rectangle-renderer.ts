import { ObjectRenderer } from '../abstract/object-renderer';
import { Rectangle } from './rectangle';

export class RectangleRenderer extends ObjectRenderer<Rectangle> {
  override render(): void {
    const { x, y, width, height, rotation, color } = this.object;

    this.context.save();

    this.context.beginPath();

    // move the rotation point to the center of the rect
    this.context.translate(x + width / 2, y + height / 2);
    this.context.rotate((rotation * Math.PI) / 180);
    this.context.rect(-width / 2, -height / 2, width, height);

    this.context.fillStyle = color;
    this.context.fill();

    this.context.closePath();

    this.context.restore();
  }
}
