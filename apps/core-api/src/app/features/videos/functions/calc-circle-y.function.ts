import { toRadians } from './to-radians.function';

export const calcCircleY = (
  centerY: number,
  radius: number,
  angle: number
): number => centerY + radius * Math.sin(toRadians(angle));
