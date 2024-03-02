export const getRandomBetween = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));
