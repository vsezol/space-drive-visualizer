import { ObjectRenderer } from './abstract/object-renderer.abstract';
import { Highlight } from './highlight.class';

export class HighlightRenderer extends ObjectRenderer<Highlight> {
  override render(): void {
    const { x, y, radius, color } = this.object;

    const gradient = this.context.createRadialGradient(
      x,
      y,
      radius / 2,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.context.beginPath();

    this.context.arc(x, y, radius, 0, 2 * Math.PI);

    this.context.fillStyle = gradient;
    this.context.fill();

    this.context.closePath();
  }
}
