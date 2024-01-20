import { Module } from '@nestjs/common';
import { VideoRendererService } from './video-renderer.service';
import { VideosController } from './videos.controller';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [VideoRendererService],
})
export class VideosModule {}
