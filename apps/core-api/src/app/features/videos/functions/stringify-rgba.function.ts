import { ColorRGBA } from '@space-drive-visualizer/videos-contracts';

export const stringifyRGBA = ([r, g, b, a]: ColorRGBA) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
