export const calcCircleY = (
  centerY: number,
  radius: number,
  angle: number
): number => centerY + radius * Math.sin((angle * Math.PI) / 180);
