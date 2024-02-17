import { Module } from '@nestjs/common';
import { FramesPreprocessingService } from './frames-preprocessing.service';
import { RenderRequestMapperService } from './render-request-mapper.service';
import { SpritesService } from './sprites.service';
import { VideoRendererService } from './video-renderer.service';
import { VideosController } from './videos.controller';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [
    VideoRendererService,
    FramesPreprocessingService,
    RenderRequestMapperService,
    SpritesService,
  ],
})
export class VideosModule {}
