import { ColorRGB } from '@space-drive-visualizer/videos-contracts';

export const stringifyRGB = ([r, g, b]: ColorRGB) => `rgb(${r}, ${g}, ${b})`;
