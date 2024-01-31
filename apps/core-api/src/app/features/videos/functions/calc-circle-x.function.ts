import { toRadians } from './to-radians.function';

export const calcCircleX = (
  centerX: number,
  radius: number,
  angle: number
): number => centerX + radius * Math.cos(toRadians(angle));
