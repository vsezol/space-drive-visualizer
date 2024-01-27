import { Injectable } from '@nestjs/common';
import { Sprite, createSprite } from '@space-drive-visualizer/sprite';
import { Image, loadImage } from 'canvas';
import { join } from 'path';
import { Observable, defer, forkJoin, map, shareReplay } from 'rxjs';
import { getAssetsDirPath } from '../../common/path.utils';
import { SpriteName } from './contracts/sprite-name.enum';

@Injectable()
export class SpritesService {
  readonly sprites$: Observable<Record<string, Sprite>> =
    this.getSprites().pipe(shareReplay(1));

  private getSprites(): Observable<Record<string, Sprite>> {
    const sprites = getSpritePaths()
      .map(loadImage)
      .map((promise) => defer(() => promise));

    return forkJoin(sprites).pipe(map(createSpritesConfig));
  }
}

function createSpritesConfig([barrierSprite, spaceshipsSprite]: [
  Image,
  Image
]): Record<string, Sprite> {
  return {
    [SpriteName.BarrierLeft]: createSprite({
      source: barrierSprite,
      segment: {
        width: 128,
        height: 128,
      },
      gap: 10,
      rows: 4,
      columns: 8,
    }),
    [SpriteName.BarrierRight]: createSprite({
      source: barrierSprite,
      segment: {
        width: 128,
        height: 128,
      },
      gap: 10,
      rows: 4,
      columns: 8,
      offset: {
        rows: 4,
        columns: 0,
      },
    }),
    [SpriteName.Player]: createSprite({
      source: spaceshipsSprite,
      segment: {
        width: 96,
        height: 96,
      },
      gap: 0,
      rows: 1,
      columns: 1,
      offset: {
        rows: 1,
        columns: 6,
      },
    }),
    [SpriteName.Enemy]: createSprite({
      source: spaceshipsSprite,
      segment: {
        width: 96,
        height: 96,
      },
      gap: 0,
      rows: 1,
      columns: 1,
      offset: {
        rows: 1,
        columns: 7,
      },
    }),
  };
}

function getSpritePaths(): [string, string] {
  return [
    join(getAssetsDirPath(), 'barrier-sprite.png'),
    join(getAssetsDirPath(), 'spaceships-sprite.png'),
  ];
}
