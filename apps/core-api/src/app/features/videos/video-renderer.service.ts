import { Injectable } from '@nestjs/common';
import { saveStreamsSequence } from '@space-drive-visualizer/files';
import { loadImage } from 'canvas';
import { createReadStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { convertImagesToVideo } from './convert-images-to-video.function';
import { RenderVideoRequestDto } from './dto/request/render-video-request.dto';
import { FrameRenderer } from './frame-renderer.class';

@Injectable()
export class VideoRendererService {
  async render(data: RenderVideoRequestDto): Promise<Readable> {
    const spriteImage = await loadImage(
      join(getAssetsDirPath(), 'barrier-sprite.png')
    );

    const streams = data.frames.map((frame, index) =>
      new FrameRenderer(
        {
          width: data.scene.width,
          height: data.scene.height,
        },
        spriteImage,
        index
      ).render(frame)
    );

    const tempFolderPath = getTempDirPath();

    await mkdir(tempFolderPath, { recursive: true });
    await saveStreamsSequence(streams, (index) =>
      join(tempFolderPath, getFileNameByIndex(index))
    );

    await Promise.all(streams);

    const videoPath = join(tempFolderPath, 'video.mp4');

    await convertImagesToVideo({
      inputPath: join(tempFolderPath, 'frame-%03d.png'),
      outputPath: videoPath,
      frameRate: data.frameRate,
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

  return `frame-${fileNumber}.png`;
}
