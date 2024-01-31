import {
  Body,
  Controller,
  Post,
  StreamableFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { RenderVideoRequestDto } from './dto/render-video-request.dto';
import { VideoRendererService } from './video-renderer.service';

@Controller('videos')
@ApiTags()
export class VideosController {
  constructor(private readonly videoRendererService: VideoRendererService) {}

  @Post('render')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('video/mp4')
  async visualize(
    @Body(new ValidationPipe({ transform: true })) body: RenderVideoRequestDto
  ) {
    const videoFileStream = await this.videoRendererService.render(body);

    return new StreamableFile(videoFileStream);
  }
}
