import { toRadians } from './to-radians';

export const calcCircleY = (
  centerY: number,
  radius: number,
  angle: number
): number => centerY + radius * Math.sin(toRadians(angle));
