import {
  Barrier,
  Bullet,
  ColorRGB,
  RenderObjectType,
  RenderVideoRequest,
  Spaceship,
} from '@space-drive-visualizer/videos-contracts';
import axios, { AxiosResponse } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';
import { v4 } from 'uuid';

// Single Thread PNG
// 600 frames 60fps - 16.089s

// Single Thread JPEG
// 600 frames 60fps 0.75 quality - 1.84s
// 6000 frames 60fps 0.1 quality - 18.728s
// 6000 frames 60fps 0.75 quality - 17.706s, 4.3mb
// 6000 frames 60fps 1.0 quality - 19.554s, 4mb
// 6000 frames 60fps 1.0 quality progressive - 34.105s, 4.3mb

const createTestRequestBody = (): RenderVideoRequest => {
  const bullets = [
    createBullet(10, 10, [64, 255, 76]),
    createBullet(500, 250, [0, 200, 76]),
    createBullet(500, 250, [0, 255, 50]),
    createBullet(500, 250, [255, 255, 0]),
  ];

  const barriers = [
    createBarrier(800, 400, 100),
    createBarrier(250, 250, 125),
    createBarrier(800, 100, 150),
  ];

  const spaceships = [
    createSpaceship({
      x: 530,
      y: 275,
      rotation: 180,
      width: 95,
      height: 95,
      color: [255, 201, 129],
    }),
    createSpaceship({
      x: 550,
      y: 300,
      rotation: 180,
      width: 50,
      height: 50,
      color: [64, 255, 76],
    }),
    createSpaceship({
      x: 250,
      y: 250,
      rotation: 0,
      width: 95,
      height: 95,
      color: [64, 255, 255],
    }),
    createSpaceship({
      x: 100,
      y: 100,
      rotation: 0,
      width: 125,
      height: 125,
      color: [255, 0, 255],
    }),
  ];

  return {
    scene: {
      width: 1000,
      height: 500,
    },
    frames: new Array(600).fill('').map((_, index) => ({
      objects: [
        {
          ...spaceships[0],
          x: 530 - 200 * Math.cos((-index * 0.5 * Math.PI) / 180),
          y: 275 - 200 * Math.sin((-index * 0.5 * Math.PI) / 180),
          rotation: 180 - index * 0.5,
        },
        {
          ...spaceships[1],
          x: spaceships[1].x - 100 * Math.cos((-index * 2 * Math.PI) / 180),
          y: spaceships[1].y - 100 * Math.sin((-index * 2 * Math.PI) / 180),
          rotation: spaceships[1].rotation - index * 2,
        },
        {
          ...spaceships[2],
          x: spaceships[2].x - 200 * Math.cos((index * Math.PI) / 180),
          y: spaceships[2].y - 200 * Math.sin((index * Math.PI) / 180),
          rotation: index,
        },
        {
          ...spaceships[3],
          x: spaceships[3].x - 200 * Math.cos((index * Math.PI) / 180),
          y: spaceships[3].y - 200 * Math.sin((index * Math.PI) / 180),
          rotation: index,
        },
        {
          ...bullets[0],
          x: bullets[0].x + index,
          y: bullets[0].y + index,
        },
        {
          ...bullets[1],
          y: bullets[1].y + index,
        },
        {
          ...bullets[2],
          x: bullets[2].x + index,
        },
        {
          ...bullets[3],
          x: bullets[3].x - index,
        },
        ...barriers,
      ],
    })),
    frameRate: 60,
  };
};

function createSpaceship({
  x,
  y,
  rotation,
  width,
  height,
  color,
}: Omit<Spaceship, 'id' | 'type'>): Spaceship {
  return {
    id: v4(),
    x,
    y,
    rotation,
    width,
    height,
    type: RenderObjectType.Spaceship,
    color,
  };
}

function createBullet(x: number, y: number, color: ColorRGB): Bullet {
  return {
    id: v4(),
    x,
    y,
    radius: 10,
    type: RenderObjectType.Bullet,
    color,
  };
}

function createBarrier(x: number, y: number, size: number): Barrier {
  return {
    id: v4(),
    x,
    y,
    width: size,
    height: size,
    type: RenderObjectType.Barrier,
  };
}

describe('GET /api', () => {
  it(
    'should return a message',
    async () => {
      let res: AxiosResponse<Stream, unknown>;

      try {
        res = await axios.post<Stream>(
          `/api/videos/render`,
          createTestRequestBody(),
          {
            responseType: 'stream',
          }
        );
      } catch (error) {
        console.log(error.message);
      }

      const outputPath = join(__dirname, '../temp/test-response.mp4');

      await writeStreamToFile(res.data, outputPath);

      expect(res.status).toBe(201);
    },
    60 * 1000
  );
});

function writeStreamToFile(stream: Stream, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writeStream = stream.pipe(createWriteStream(outputPath));

    writeStream.on('error', (err) => reject(err));
    writeStream.on('finish', () => resolve());
  });
}
