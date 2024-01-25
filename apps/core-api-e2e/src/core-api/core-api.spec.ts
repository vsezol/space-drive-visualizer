import axios, { AxiosResponse } from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';

const createTestRequestBody = () => ({
  scene: {
    width: 1000,
    height: 500,
  },
  frames: new Array(190).fill('').map((_, index) => ({
    objects: [
      {
        x: 10 + index * 5,
        y: 10 + index,
        rotation: 0 + index,
        width: 100,
        height: 50,
        type: 'player',
      },
      {
        x: 900 - index * 5,
        y: 350 - index,
        rotation: 50 + index,
        width: 100,
        height: 50,
        type: 'enemy',
      },
      {
        x: 10 + index * 15,
        y: 10 + index * 25,
        rotation: 0,
        width: 10,
        height: 10,
        type: 'bullet',
      },
      {
        x: 500 + index * 15,
        y: 250 + index,
        rotation: 0,
        width: 25,
        height: 25,
        type: 'bullet',
      },
      {
        x: 800,
        y: 400,
        rotation: 0,
        width: 100,
        height: 100,
        type: 'barrier',
      },
      {
        x: 250,
        y: 250,
        rotation: 0,
        width: 125,
        height: 125,
        type: 'barrier',
      },
      {
        x: 800,
        y: 100,
        rotation: 0,
        width: 175,
        height: 175,
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
