import { Logger } from '@nestjs/common';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { ConvertImagesToVideoOptions } from './contracts';

export async function convertImagesToVideo(
  options: ConvertImagesToVideoOptions
): Promise<void> {
  const { inputPath, outputPath, frameRate } = options;

  ffmpeg.setFfmpegPath(ffmpegStatic ?? '');

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .inputOptions('-framerate', frameRate.toString())
      .videoCodec('libx264')
      .outputOptions('-pix_fmt', 'yuv420p')
      .saveToFile(outputPath)
      .on('progress', (info) => {
        const percent = Math.round((info.frames / options.totalCount) * 100);
        Logger.log(`Processing ${percent}%`);
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });
}
