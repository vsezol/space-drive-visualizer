import { Injectable } from '@nestjs/common';
import { saveStreamsSequence } from '@space-drive-visualizer/files';
import { FrameRenderer } from '@space-drive-visualizer/frame-renderer';
import { Sprite, createSprite } from '@space-drive-visualizer/sprite';
import { convertImagesToVideo } from '@space-drive-visualizer/video-converter';
import { loadImage } from 'canvas';
import { createReadStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { SpriteName } from './contracts/sprite-name.enum';
import { RenderVideoRequestDto } from './dto/request/render-video-request.dto';
import { mapRenderFrameToFrame } from './functions/map-render-frame-to-frame.function';

@Injectable()
export class VideoRendererService {
  async render(data: RenderVideoRequestDto): Promise<Readable> {
    const sprites = await getSprites();

    const streams = data.frames
      .map(mapRenderFrameToFrame)
      .map((frame, frameIndex) => {
        // TODO create one-time initialization
        const renderer = new FrameRenderer({
          width: data.scene.width,
          height: data.scene.height,
          frameIndex,
          sprites,
        });

        return renderer.render(frame);
      });

    const tempFolderPath = getTempDirPath();

    await mkdir(tempFolderPath, { recursive: true });
    await saveStreamsSequence(streams, (index) =>
      join(tempFolderPath, getFileNameByIndex(index))
    );

    await Promise.all(streams);

    const videoPath = join(tempFolderPath, 'video.mp4');

    await convertImagesToVideo({
      inputPath: join(tempFolderPath, 'frame-%03d.jpeg'),
      outputPath: videoPath,
      frameRate: data.frameRate,
      totalCount: streams.length,
    });

    return createReadStream(videoPath);
  }
}

function getAssetsDirPath(): string {
  return join(process.cwd(), 'apps/core-api/src/assets');
}

function getTempDirPath(): string {
  const tempFolderName = v4();
  return join(process.cwd(), 'apps/core-api/temp', tempFolderName);
}

function getFileNameByIndex(i: number) {
  const fileNumber = (i + 1).toString().padStart(3, '0');

  return `frame-${fileNumber}.jpeg`;
}

async function getSprites(): Promise<Record<string, Sprite>> {
  const asteroidSprite = await loadImage(
    join(getAssetsDirPath(), 'barrier-sprite.png')
  );
  const spaceshipsSprite = await loadImage(
    join(getAssetsDirPath(), 'spaceships-sprite.png')
  );

  const sprites: Record<string, Sprite> = {
    [SpriteName.AsteroidLeft]: createSprite({
      source: asteroidSprite,
      segment: {
        width: 128,
        height: 128,
      },
      gap: 10,
      rows: 4,
      columns: 8,
    }),
    [SpriteName.AsteroidRight]: createSprite({
      source: asteroidSprite,
      segment: {
        width: 128,
        height: 128,
      },
      gap: 10,
      rows: 4,
      columns: 8,
      offset: {
        rows: 4,
        columns: 0,
      },
    }),
    [SpriteName.SpaceshipGreen]: createSprite({
      source: spaceshipsSprite,
      segment: {
        width: 96,
        height: 96,
      },
      gap: 0,
      rows: 1,
      columns: 1,
      offset: {
        rows: 1,
        columns: 6,
      },
    }),
    [SpriteName.SpaceshipOrange]: createSprite({
      source: spaceshipsSprite,
      segment: {
        width: 96,
        height: 96,
      },
      gap: 0,
      rows: 1,
      columns: 1,
      offset: {
        rows: 1,
        columns: 7,
      },
    }),
  };

  return sprites;
}
