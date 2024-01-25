import { ObjectRenderer } from './abstract/object-renderer.abstract';
import { Circle } from './circle.class';

export class CircleRenderer extends ObjectRenderer<Circle> {
  render(): void {
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
