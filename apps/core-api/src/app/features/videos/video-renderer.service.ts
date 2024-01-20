import { Injectable } from '@nestjs/common';
import { saveStreamsSequence } from '@space-drive-visualizer/files';
import { createReadStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { convertImagesToVideo } from './convert-images-to-video.function';
import { FrameRenderer } from './frame-renderer.class';

@Injectable()
export class VideoRendererService {
  async render(): Promise<Readable> {
    const streams = new Array(100)
      .fill(['red', 'green', 'blue', 'yellow', 'black', 'white'])
      .flat()
      .map((color) =>
        new FrameRenderer({
          width: 400,
          height: 400,
        }).render(color)
      );

    const tempFolderPath = getTempFolderPath();

    await mkdir(tempFolderPath, { recursive: true });
    await saveStreamsSequence(streams, (index) =>
      join(tempFolderPath, getFileNameByIndex(index))
    );

    await Promise.all(streams);

    const videoPath = join(tempFolderPath, 'video.mp4');

    await convertImagesToVideo({
      inputPath: join(tempFolderPath, 'frame-%03d.png'),
      outputPath: videoPath,
      frameRate: 60,
    });

    return createReadStream(videoPath);
  }
}

function getTempFolderPath(): string {
  const tempFolderName = v4();
  return join(process.cwd(), 'apps/core-api/temp', tempFolderName);
}

function getFileNameByIndex(i: number) {
  const fileNumber = (i + 1).toString().padStart(3, '0');

  return `frame-${fileNumber}.png`;
}
