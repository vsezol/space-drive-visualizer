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

const playerId = v4();
const enemyId = v4();

const createTestRequestBody = () => ({
  scene: {
    width: 1000,
    height: 500,
  },
  frames: new Array(600).fill('').map((_, index) => ({
    objects: [
      {
        id: playerId,
        x: 530 - 200 * Math.cos((-index * 0.5 * Math.PI) / 180),
        y: 275 - 200 * Math.sin((-index * 0.5 * Math.PI) / 180),
        rotation: 180 - index * 0.5,
        width: 95,
        height: 95,
        type: 'player',
      },
      {
        id: enemyId,
        x: 250 - 200 * Math.cos((index * Math.PI) / 180),
        y: 250 - 200 * Math.sin((index * Math.PI) / 180),
        rotation: index,
        width: 95,
        height: 95,
        type: 'enemy',
      },
      {
        id: v4(),
        x: 10 + index * 5,
        y: 10 + index * 5,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: v4(),
        x: 500 + index * 5,
        y: 250 + index,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: v4(),
        x: 500 + index * 5,
        y: 250 - index * 5,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        id: v4(),
        x: 500 - index * 5,
        y: 250 - index * 5,
        rotation: 0,
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
