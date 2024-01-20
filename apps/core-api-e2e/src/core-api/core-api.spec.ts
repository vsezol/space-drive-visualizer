import axios from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get<Stream>(`/api/visualize`, {
      responseType: 'stream',
    });

    const outputPath = join(__dirname, '../temp/test-response.mp4');
    console.log(__dirname, outputPath);

    await writeStreamToFile(res.data, outputPath);

    expect(res.status).toBe(200);
  });
});

function writeStreamToFile(stream: Stream, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writeStream = stream.pipe(createWriteStream(outputPath));

    writeStream.on('error', (err) => reject(err));
    writeStream.on('finish', () => resolve());
  });
}
