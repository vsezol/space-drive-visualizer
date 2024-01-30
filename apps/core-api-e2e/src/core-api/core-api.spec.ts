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

const playersIds = [v4(), v4(), v4(), v4()];
const bulletsIds = [v4(), v4(), v4(), v4()];

const createTestRequestBody = () => ({
  scene: {
    width: 1000,
    height: 500,
  },
  frames: new Array(600).fill('').map((_, index) => ({
    objects: [
      {
        id: playersIds[0],
        x: 530 - 200 * Math.cos((-index * 0.5 * Math.PI) / 180),
        y: 275 - 200 * Math.sin((-index * 0.5 * Math.PI) / 180),
        rotation: 180 - index * 0.5,
        width: 95,
        height: 95,
        type: 'spaceship',
        meta: {
          color: [255, 201, 129],
        },
      },
      {
        id: playersIds[1],
        x: 550 - 100 * Math.cos((-index * 2 * Math.PI) / 180),
        y: 300 - 100 * Math.sin((-index * 2 * Math.PI) / 180),
        rotation: 180 - index * 2,
        width: 50,
        height: 50,
        type: 'spaceship',
        meta: {
          color: [64, 255, 76],
        },
      },
      {
        id: playersIds[2],
        x: 250 - 200 * Math.cos((index * Math.PI) / 180),
        y: 250 - 200 * Math.sin((index * Math.PI) / 180),
        rotation: index,
        width: 95,
        height: 95,
        type: 'spaceship',
        meta: {
          color: [64, 255, 255],
        },
      },
      {
        id: playersIds[3],
        x: 100 - 200 * Math.cos((index * Math.PI) / 180),
        y: 100 - 200 * Math.sin((index * Math.PI) / 180),
        rotation: index,
        width: 125,
        height: 125,
        type: 'spaceship',
        meta: {
          color: [255, 0, 255],
        },
      },
      {
        id: bulletsIds[0],
        x: 10 + index,
        y: 10 + index,
        rotation: -45,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: bulletsIds[1],
        x: 500,
        y: 250 + index,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: bulletsIds[2],
        x: 500 + index,
        y: 250,
        rotation: 90,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: bulletsIds[3],
        x: 500 - index,
        y: 250,
        rotation: 90,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: v4(),
        x: 800,
        y: 400,
        rotation: index * 2,
        width: 100,
        height: 100,
        type: 'barrier',
      },
      {
        id: v4(),
        x: 250,
        y: 250,
        rotation: index,
        width: 125,
        height: 125,
        type: 'barrier',
      },
      {
        id: v4(),
        x: 800,
        y: 100,
        rotation: -index,
        width: 150,
        height: 150,
        type: 'barrier',
      },
    ],
  })),
  frameRate: 60,
});

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
