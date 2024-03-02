import {
  Body,
  Controller,
  Post,
  StreamableFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PreprocessorDataDto } from './contracts/preprocessor.dto';
import { VideoRendererService } from './video-renderer.service';

@Controller('videos')
@ApiTags('videos')
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
    @Body(new ValidationPipe({ transform: true })) body: PreprocessorDataDto
  ) {
    const videoFileStream = await this.videoRendererService.render(body);

    return new StreamableFile(videoFileStream);
  }
}
