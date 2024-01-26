import axios, { AxiosResponse } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';

// Single Thread PNG
// 600 frames 60fps - 16.089s

// Single Thread JPEG
// 600 frames 60fps 0.75 quality - 1.84s
// 6000 frames 60fps 0.1 quality - 18.728s
// 6000 frames 60fps 0.75 quality - 17.706s, 4.3mb
// 6000 frames 60fps 1.0 quality - 19.554s, 4mb
// 6000 frames 60fps 1.0 quality progressive - 34.105s, 4.3mb

const createTestRequestBody = () => ({
  scene: {
    width: 1000,
    height: 500,
  },
  frames: new Array(600).fill('').map((_, index) => ({
    objects: [
      {
        x: 10 + index * 3,
        y: 10 + index,
        rotation: 0 + index,
        width: 95,
        height: 95,
        type: 'player',
      },
      {
        x: 900 - index * 3,
        y: 350 - index,
        rotation: 0 + index,
        width: 95,
        height: 95,
        type: 'enemy',
      },
      {
        x: 10 + index * 5,
        y: 10 + index * 5,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        x: 500 + index * 5,
        y: 250 + index,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        x: 500 + index * 5,
        y: 250 - index * 5,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        x: 500 - index * 5,
        y: 250 - index * 5,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        x: 800,
        y: 400,
        rotation: index * 2,
        width: 100,
        height: 100,
        type: 'barrier',
      },
      {
        x: 250,
        y: 250,
        rotation: index,
        width: 125,
        height: 125,
        type: 'barrier',
      },
      {
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
        console.log(error);
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
