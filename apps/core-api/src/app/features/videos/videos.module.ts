import { Module } from '@nestjs/common';
import { SpritesService } from './sprites.service';
import { VideoRendererService } from './video-renderer.service';
import { VideosController } from './videos.controller';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [VideoRendererService, SpritesService],
})
export class VideosModule {}
