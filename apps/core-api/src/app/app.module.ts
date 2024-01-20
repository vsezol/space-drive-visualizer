import { Module } from '@nestjs/common';

import { VideosModule } from './features/videos/videos.module';

@Module({
  imports: [VideosModule],
})
export class AppModule {}
