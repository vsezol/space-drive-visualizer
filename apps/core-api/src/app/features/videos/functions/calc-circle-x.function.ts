export const calcCircleX = (
  centerX: number,
  radius: number,
  angle: number
): number => centerX + radius * Math.cos((angle * Math.PI) / 180);
