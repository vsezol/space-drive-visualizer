import { BaseObject } from '../abstract/base-object';

export class Label extends BaseObject {
  readonly color: string;
  readonly text: string;
  readonly fontSize: number;

  constructor({ x, y, text, color, fontSize }: Label) {
    super({ x, y });
    this.color = color;
    this.text = text;
    this.fontSize = fontSize;
  }
}
