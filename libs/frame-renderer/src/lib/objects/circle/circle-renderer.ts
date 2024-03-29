import { ObjectRenderer } from '../abstract/object-renderer';
import { Circle } from './circle';

export class CircleRenderer extends ObjectRenderer<Circle> {
  override render(): void {
    this.context.beginPath();

    this.context.arc(
      this.object.x,
      this.object.y,
      this.object.radius,
      0,
      2 * Math.PI
    );

    this.context.fillStyle = this.object.color;
    this.context.fill();

    this.context.closePath();
  }
}
