import {
  RenderRequest,
  RenderRequestBarrier,
  RenderRequestMissile,
  RenderRequestObjectType,
  RenderRequestPlayer,
} from '@space-drive-visualizer/videos-contracts';
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

function* missileShooter(
  times: number,
  width: number,
  height: number
): Generator<RenderRequestMissile[], undefined, [number, number]> {
  let missiles: RenderRequestMissile[] = [];
  let lastPoint: [number, number];

  for (let i = 0; i < times; i++) {
    const [x, y] = yield missiles;

    if (Array.isArray(lastPoint)) {
      const deltaX = x - lastPoint[0];
      const deltaY = y - lastPoint[1];

      missiles = missiles
        .map((item) => ({
          ...item,
          x: item.x + deltaX * 4,
          y: item.y + deltaY * 4,
        }))
        .filter(({ x, y }) => x <= width && x >= 0 && y <= height && y >= 0);
    }

    lastPoint = [x, y];

    if (i % 20 === 0) {
      missiles.push(createMissile(x, y));
    }
  }
}

const createTestRequestBody = (framesCount: number): RenderRequest => {
  const missiles = [
    createMissile(10, 10),
    createMissile(500, 250),
    createMissile(500, 250),
    createMissile(500, 250),
  ];

  const barriers = [
    createBarrier(800, 400, 100),
    createBarrier(250, 250, 125),
    createBarrier(800, 100, 150),
  ];

  const players = [
    createPlayer({
      x: 530,
      y: 275,
      direction: 180,
      r: 95,
    }),
    createPlayer({
      x: 550,
      y: 300,
      direction: 180,
      r: 50,
    }),
    createPlayer({
      x: 250,
      y: 250,
      direction: 0,
      r: 95,
    }),
    createPlayer({
      x: 100,
      y: 100,
      direction: 0,
      r: 125,
    }),
    createPlayer({
      x: 700,
      y: 200,
      direction: 0,
      r: 75,
    }),
  ];

  const shooter = missileShooter(framesCount - 1, 1000, 500);

  const getShoots = (x: number, y: number) => {
    const result = shooter.next([x, y]);

    return result.value ?? [];
  };

  return {
    map: {
      width: 1000,
      height: 500,
      seed: Math.trunc(Math.random() * 1000),
      barriers,
    },
    history: new Array(framesCount).fill('').map((_, index) => ({
      time: index,
      objects: [
        {
          ...players[0],
          x: 530 - 200 * Math.cos((-index * 0.5 * Math.PI) / 180),
          y: 275 - 200 * Math.sin((-index * 0.5 * Math.PI) / 180),
          direction: 180 - index * 0.5,
        },
        {
          ...players[1],
          x: players[1].x - 100 * Math.cos((-index * 2 * Math.PI) / 180),
          y: players[1].y - 100 * Math.sin((-index * 2 * Math.PI) / 180),
          direction: players[1].direction - index * 2,
        },
        {
          ...players[2],
          x: players[2].x - 200 * Math.cos((index * Math.PI) / 180),
          y: players[2].y - 200 * Math.sin((index * Math.PI) / 180),
          direction: index,
        },
        {
          ...players[3],
          x: players[3].x - 200 * Math.cos((index * Math.PI) / 180),
          y: players[3].y - 200 * Math.sin((index * Math.PI) / 180),
          direction: index,
        },
        ...getShoots(
          players[4].x - 100 * Math.cos((index * 0.5 * Math.PI) / 180),
          players[4].y - 100 * Math.sin((index * 0.5 * Math.PI) / 180)
        ),
        {
          ...players[4],
          x: players[4].x - 100 * Math.cos((index * 0.5 * Math.PI) / 180),
          y: players[4].y - 100 * Math.sin((index * 0.5 * Math.PI) / 180),
          direction: players[4].direction + index * 0.5,
        },
        {
          ...missiles[0],
          x: missiles[0].x + index,
          y: missiles[0].y + index,
        },
        {
          ...missiles[1],
          y: missiles[1].y + index * 2,
        },
        {
          ...missiles[2],
          x: missiles[2].x + index * 2,
        },
        {
          ...missiles[3],
          x: missiles[3].x - index,
        },
      ],
    })),
    players: [
      {
        id: players[0].id,
        ip: '',
        name: 'ABOBA 23 y.o',
      },
      {
        id: players[1].id,
        ip: '',
        name: 'Yellow Snow',
      },
      {
        id: players[2].id,
        ip: '',
        name: 'Vsevolod Zolotov',
      },
      {
        id: players[3].id,
        ip: '',
        name: 'Turboflex',
      },
      {
        id: players[4].id,
        ip: '',
        name: 'Пупкина Залупкина',
      },
    ],
  };
};

function createPlayer({
  x,
  y,
  direction,
  r,
}: Omit<RenderRequestPlayer, 'id' | 'object'>): RenderRequestPlayer {
  return {
    object: RenderRequestObjectType.Player,
    id: Math.trunc(Math.random() * 10000),
    x,
    y,
    direction,
    r,
  };
}

function createMissile(x: number, y: number): RenderRequestMissile {
  return {
    x,
    y,
    object: RenderRequestObjectType.Missile,
    direction: 0,
    id: Math.trunc(Math.random() * 10000),
  };
}

function createBarrier(
  x: number,
  y: number,
  size: number
): RenderRequestBarrier {
  return {
    x,
    y,
    r: size,
  };
}

describe('GET /videos', () => {
  it(
    'should return a message',
    async () => {
      let res: AxiosResponse<Stream, unknown>;

      try {
        res = await axios.post<Stream>(
          `/videos/render`,
          createTestRequestBody(600),
          {
            responseType: 'stream',
          }
        );
      } catch (error) {
        console.log(JSON.stringify(error));
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
