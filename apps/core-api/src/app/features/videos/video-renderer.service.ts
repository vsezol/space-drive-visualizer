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

import { RenderRequestDto } from './contracts/render-request.dto';
import { FramesPreprocessingService } from './frames-preprocessing.service';
import { RenderRequestMapperService } from './render-request-mapper.service';
import { SpritesService } from './sprites.service';

@Injectable()
export class VideoRendererService {
  constructor(
    private readonly spritesService: SpritesService,
    private readonly renderRequestMapperService: RenderRequestMapperService,
    private readonly framesPreprocessingService: FramesPreprocessingService
  ) {}

  async render(data: RenderRequestDto): Promise<Readable> {
    const sprites = await lastValueFrom(this.spritesService.sprites$);

    const streams = this.framesPreprocessingService
      .preprocess(data.frames)
      .map((frame, index) =>
        this.renderRequestMapperService.toRendererFrame(frame, index)
      )
      .map((frame) => {
        // TODO create one-time initialization
        const renderer = new FrameRenderer({
          width: data.scene.width,
          height: data.scene.height,
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
