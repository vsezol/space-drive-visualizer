import { ObjectRenderer } from '../abstract/object-renderer';
import { Label } from './label';

export class LabelRenderer extends ObjectRenderer<Label> {
  override render(): void {
    const { x, y, text, fontSize, color } = this.object;

    this.context.font = `bold ${fontSize}px serif`;
    this.context.textAlign = 'start';
    this.context.textBaseline = 'top';

    this.context.fillStyle = color;

    this.context.fillText(text, x, y);
  }
}
