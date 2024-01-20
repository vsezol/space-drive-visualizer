import { Controller, Get, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { VideoRendererService } from './video-renderer.service';

@Controller('videos')
@ApiTags()
export class VideosController {
  constructor(private readonly videoRendererService: VideoRendererService) {}

  @Get('render')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('video/mp4')
  async visualize() {
    const videoFileStream = await this.videoRendererService.render();

    return new StreamableFile(videoFileStream);
  }
}
