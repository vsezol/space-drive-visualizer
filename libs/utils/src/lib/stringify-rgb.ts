export type ColorRGB = [number, number, number];

export const stringifyRGB = ([r, g, b]: ColorRGB) => `rgb(${r}, ${g}, ${b})`;
