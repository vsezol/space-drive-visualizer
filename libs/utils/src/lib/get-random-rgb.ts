import { getRandomBetween } from './get-random-between';
import { ColorRGB } from './stringify-rgb';

export const getRandomRGB = (): ColorRGB => {
  return [
    getRandomBetween(0, 255),
    getRandomBetween(0, 255),
    getRandomBetween(0, 255),
  ];
};
