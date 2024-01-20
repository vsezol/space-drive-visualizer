import { Controller, Get, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('visualize')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('video/mp4')
  visualize() {
    const fileStream = this.appService.getFileStream('test.mp4');

    return new StreamableFile(fileStream);
  }
}
