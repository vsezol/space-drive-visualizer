export type ColorRGBA = [number, number, number, number];

export const stringifyRGBA = ([r, g, b, a]: ColorRGBA) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
