import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  getFileStream(fileName: string) {
    return createReadStream(join(__dirname, 'temp', fileName));
  }
}
