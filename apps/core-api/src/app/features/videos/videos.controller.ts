import {
  Body,
  Controller,
  Post,
  StreamableFile,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { RenderRequestDto } from './contracts/render-request.dto';
import { FramesPreprocessingService } from './frames-preprocessing.service';
import { VideoRendererService } from './video-renderer.service';

@Controller('videos')
@ApiTags('videos')
export class VideosController {
  constructor(
    private readonly videoRendererService: VideoRendererService,
    private readonly preprocessingService: FramesPreprocessingService
  ) {}

  @Post('render')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('video/mp4')
  async visualize(
    @Body(new ValidationPipe({ transform: true })) requestBody: RenderRequestDto
  ) {
    const videoFileStream = await this.videoRendererService.render(
      requestBody.toPreprocessorData()
    );

    return new StreamableFile(videoFileStream);
  }
}
