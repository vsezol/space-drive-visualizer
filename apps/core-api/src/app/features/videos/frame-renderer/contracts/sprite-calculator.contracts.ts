export interface OutputImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

export interface DrawImageOptions {
  source: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  target: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
