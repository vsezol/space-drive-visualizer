import {
  ColorRGB,
  ColorRGBA,
  getUuid,
  stringifyRGB,
  stringifyRGBA,
} from '@space-drive-visualizer/utils';
import {
  PreprocessorBarrier,
  PreprocessorBullet,
  PreprocessorData,
  PreprocessorFlame,
  PreprocessorFrame,
  PreprocessorHighlight,
  PreprocessorObject,
  PreprocessorObjectType,
  PreprocessorPlayerInfo,
  PreprocessorScene,
  PreprocessorSpaceship,
} from '@space-drive-visualizer/videos-contracts';

import {
  BaseObject,
  Circle,
  Highlight,
  Label,
  SpriteObject,
} from '@space-drive-visualizer/frame-renderer';
import { Type, plainToInstance } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { SpriteName } from './sprite-name';

export class PreprocessorSceneDto implements PreprocessorScene {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  static create(options: PreprocessorSceneDto): PreprocessorScene {
    return plainToInstance(PreprocessorSceneDto, options);
  }
}

export abstract class PreprocessorObjectDto implements PreprocessorObject {
  @IsString()
  id: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  abstract toBaseObject(frameIndex: number): BaseObject;
}

export class PreprocessorSpaceshipDto
  extends PreprocessorObjectDto
  implements PreprocessorSpaceship
{
  @IsNumber()
  rotation: number;

  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  color: ColorRGB;

  @IsEnum(PreprocessorObjectType)
  type: PreprocessorObjectType.Spaceship;

  static create(
    options: Omit<PreprocessorSpaceship, 'type' | 'color' | 'toBaseObject'>
  ): PreprocessorSpaceship {
    return plainToInstance(PreprocessorSpaceshipDto, {
      ...options,
      type: PreprocessorObjectType.Spaceship,
      color: [255, 255, 255],
    });
  }

  toBaseObject(frameIndex: number): SpriteObject {
    return new SpriteObject({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      spriteName: SpriteName.Spaceship,
      frameIndex,
    });
  }
}

export class PreprocessorBulletDto
  extends PreprocessorObjectDto
  implements PreprocessorBullet
{
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  color: ColorRGB;

  @IsEnum(PreprocessorObjectType)
  type: PreprocessorObjectType.Bullet;

  static create(
    options: Omit<PreprocessorBullet, 'type' | 'color' | 'toBaseObject'>
  ): PreprocessorBullet {
    return plainToInstance(PreprocessorBulletDto, {
      ...options,
      type: PreprocessorObjectType.Bullet,
      color: [255, 0, 0],
    });
  }

  toBaseObject(): Circle {
    return new Circle({
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: stringifyRGB(this.color),
    });
  }
}

export class PreprocessorBarrierDto
  extends PreprocessorObjectDto
  implements PreprocessorBarrier
{
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsEnum(PreprocessorObjectType)
  type: PreprocessorObjectType.Barrier;

  static create(
    options: Omit<PreprocessorBarrier, 'type' | 'id' | 'toBaseObject'>
  ): PreprocessorBarrier {
    return plainToInstance(PreprocessorBarrierDto, {
      ...options,
      id: getUuid(),
      type: PreprocessorObjectType.Barrier,
    });
  }

  toBaseObject(frameIndex: number): SpriteObject {
    return new SpriteObject({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: 0,
      spriteName: SpriteName.BarrierLeft,
      frameIndex,
    });
  }
}

export class PreprocessorFlameDto
  extends PreprocessorObjectDto
  implements PreprocessorFlame
{
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  color: ColorRGBA;

  static create(
    options: Omit<PreprocessorFlameDto, 'id' | 'toBaseObject'>
  ): PreprocessorFlameDto {
    return plainToInstance(PreprocessorFlameDto, {
      id: getUuid(),
      ...options,
    });
  }

  toBaseObject(): Circle {
    const alpha = Number((0.6 + Math.random() * 0.4).toFixed(2));

    const [red, green, blue, opacity] = this.color;
    const color = `rgba(${red}, ${green}, ${blue}, ${alpha * opacity})`;

    return new Circle({
      x: this.x,
      y: this.y,
      radius: this.radius,
      color,
    });
  }
}

export class PreprocessorHighlightDto
  extends PreprocessorObjectDto
  implements PreprocessorHighlight
{
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  color: ColorRGBA;

  static create(
    options: Omit<PreprocessorHighlightDto, 'id' | 'toBaseObject'>
  ): PreprocessorHighlightDto {
    return plainToInstance(PreprocessorHighlightDto, {
      id: getUuid(),
      ...options,
    });
  }

  toBaseObject(): Highlight {
    return new Highlight({
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: stringifyRGBA(this.color),
    });
  }
}

export class PreprocessorPlayerInfoDto
  extends PreprocessorObjectDto
  implements PreprocessorPlayerInfo
{
  @IsString()
  name: string;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  color: ColorRGB;

  @IsNumber()
  fontSize: number;

  static create(
    options: Omit<PreprocessorPlayerInfo, 'toLabel' | 'toBaseObject'>
  ): PreprocessorPlayerInfoDto {
    return plainToInstance(PreprocessorPlayerInfoDto, options);
  }

  toBaseObject(): Label {
    return new Label({
      x: this.x,
      y: this.y,
      color: stringifyRGB(this.color),
      text: this.name,
      fontSize: this.fontSize,
    });
  }
}

export class PreprocessorFrameDto implements PreprocessorFrame {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  objects: PreprocessorObjectDto[];

  static create(options: PreprocessorFrame): PreprocessorFrameDto {
    return plainToInstance(PreprocessorFrameDto, options);
  }
}

export class PreprocessorDataDto implements PreprocessorData {
  @IsObject()
  scene: PreprocessorSceneDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PreprocessorFrameDto)
  frames: PreprocessorFrameDto[];

  @IsInt()
  @Min(1)
  @Max(120)
  frameRate: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PreprocessorPlayerInfoDto)
  players: PreprocessorPlayerInfoDto[];

  static create(options: PreprocessorData): PreprocessorDataDto {
    return plainToInstance(PreprocessorDataDto, options);
  }
}
