import { Stream } from 'stream';
import { saveStream } from './save-stream';

export async function saveStreamsSequence(
  streams: Stream[],
  getFilePathFn: (index: number) => string
): Promise<void> {
  const savings = streams.map((stream, index) => {
    return saveStream(stream, getFilePathFn(index));
  });

  await Promise.all(savings);
}
