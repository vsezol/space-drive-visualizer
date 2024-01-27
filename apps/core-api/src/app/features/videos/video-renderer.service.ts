import { Injectable } from '@nestjs/common';
import { saveStreamsSequence } from '@space-drive-visualizer/files';
import { FrameRenderer } from '@space-drive-visualizer/frame-renderer';
import { convertImagesToVideo } from '@space-drive-visualizer/video-converter';
import { createReadStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { Readable } from 'stream';
import { getUniqTempDirPath } from '../../common/path.utils';
import { RenderVideoRequestDto } from './dto/request/render-video-request.dto';
import { addVisualObjects } from './functions/add-visual-objects.function';
import { mapRenderFrameToFrame } from './functions/map-render-frame-to-frame.function';
import { SpritesService } from './sprites.service';

@Injectable()
export class VideoRendererService {
  constructor(private readonly spritesService: SpritesService) {}

  async render(data: RenderVideoRequestDto): Promise<Readable> {
    const sprites = await lastValueFrom(this.spritesService.sprites$);

    const streams = addVisualObjects(data.frames)
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

    const tempFolderPath = getUniqTempDirPath();

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

function getFileNameByIndex(i: number) {
  const fileNumber = (i + 1).toString().padStart(3, '0');

  return `frame-${fileNumber}.jpeg`;
}
