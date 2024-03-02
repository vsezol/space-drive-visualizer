import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ColorRGB, ColorRGBA, getUuid } from '@space-drive-visualizer/utils';
import {
  PreprocessorBarrier,
  PreprocessorBullet,
  PreprocessorData,
  PreprocessorFlame,
  PreprocessorFrame,
  PreprocessorHighlight,
  PreprocessorObject,
  PreprocessorObjectType,
  PreprocessorScene,
  PreprocessorSpaceship,
} from '@space-drive-visualizer/videos-contracts';

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
import { stringType } from './string-type';

export class PreprocessorSceneDto implements PreprocessorScene {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 100,
  })
  width: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 100,
  })
  height: number;

  static create(options: PreprocessorSceneDto): PreprocessorScene {
    return plainToInstance(PreprocessorSceneDto, options);
  }
}

export class PreprocessorObjectDto implements PreprocessorObject {
  @IsString()
  @ApiProperty({
    example: getUuid(),
  })
  id: string;

  @IsNumber()
  @ApiProperty()
  x: number;

  @IsNumber()
  @ApiProperty()
  y: number;
}

export class PreprocessorSpaceshipDto
  extends PreprocessorObjectDto
  implements PreprocessorSpaceship
{
  @IsNumber()
  @ApiProperty()
  rotation: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 50,
  })
  width: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 50,
  })
  height: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  @ApiProperty({
    type: [String],
    minLength: 3,
    maxLength: 3,
    example: [0, 100, 255],
  })
  color: ColorRGB;

  @IsEnum(PreprocessorObjectType)
  @ApiProperty({
    type: stringType(PreprocessorObjectType.Spaceship),
    example: PreprocessorObjectType.Spaceship,
  })
  type: PreprocessorObjectType.Spaceship;

  static create(
    options: Omit<PreprocessorSpaceship, 'type' | 'color'>
  ): PreprocessorSpaceship {
    return plainToInstance(PreprocessorSpaceshipDto, {
      ...options,
      type: PreprocessorObjectType.Spaceship,
      color: [255, 255, 255],
    });
  }
}

export class PreprocessorBulletDto
  extends PreprocessorObjectDto
  implements PreprocessorBullet
{
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 10,
  })
  radius: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  @ApiProperty({
    type: [String],
    minLength: 3,
    maxLength: 3,
    example: [0, 0, 255],
  })
  color: ColorRGB;

  @IsEnum(PreprocessorObjectType)
  @ApiProperty({
    type: stringType(PreprocessorObjectType.Bullet),
    example: PreprocessorObjectType.Bullet,
  })
  type: PreprocessorObjectType.Bullet;

  static create(
    options: Omit<PreprocessorBullet, 'type' | 'color'>
  ): PreprocessorBullet {
    return plainToInstance(PreprocessorBulletDto, {
      ...options,
      type: PreprocessorObjectType.Bullet,
      color: [255, 0, 0],
    });
  }
}

export class PreprocessorBarrierDto
  extends PreprocessorObjectDto
  implements PreprocessorBarrier
{
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 50,
  })
  width: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 50,
  })
  height: number;

  @IsEnum(PreprocessorObjectType)
  @ApiProperty({
    type: stringType(PreprocessorObjectType.Barrier),
    example: PreprocessorObjectType.Barrier,
  })
  type: PreprocessorObjectType.Barrier;

  static create(
    options: Omit<PreprocessorBarrier, 'type' | 'id'>
  ): PreprocessorBarrier {
    return plainToInstance(PreprocessorBarrierDto, {
      ...options,
      id: getUuid(),
      type: PreprocessorObjectType.Barrier,
    });
  }
}

export class PreprocessorFlameDto
  extends PreprocessorObjectDto
  implements PreprocessorFlame
{
  @IsInt()
  @IsPositive()
  @ApiProperty()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [String],
    minLength: 4,
    maxLength: 4,
    example: [255, 0, 0, 0],
  })
  color: ColorRGBA;

  static create(
    options: Omit<PreprocessorFlameDto, 'id'>
  ): PreprocessorFlameDto {
    return plainToInstance<PreprocessorFlameDto, PreprocessorFlameDto>(
      PreprocessorFlameDto,
      {
        id: getUuid(),
        ...options,
      }
    );
  }
}

export class PreprocessorHighlightDto
  extends PreprocessorObjectDto
  implements PreprocessorHighlight
{
  @IsInt()
  @IsPositive()
  @ApiProperty()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [String],
    minLength: 4,
    maxLength: 4,
    example: [255, 255, 0, 0],
  })
  color: ColorRGBA;

  static create(
    options: Omit<PreprocessorHighlightDto, 'id'>
  ): PreprocessorHighlightDto {
    return plainToInstance<PreprocessorHighlightDto, PreprocessorHighlightDto>(
      PreprocessorHighlightDto,
      {
        id: getUuid(),
        ...options,
      }
    );
  }
}

@ApiExtraModels(
  PreprocessorSpaceshipDto,
  PreprocessorBarrierDto,
  PreprocessorBulletDto
)
export class PreprocessorFrameDto implements PreprocessorFrame {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PreprocessorObjectDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        {
          value: PreprocessorSpaceshipDto,
          name: PreprocessorObjectType.Spaceship,
        },
        { value: PreprocessorBarrierDto, name: PreprocessorObjectType.Barrier },
        { value: PreprocessorBulletDto, name: PreprocessorObjectType.Bullet },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  objects: PreprocessorObjectDto[];

  static create(options: PreprocessorFrame): PreprocessorFrame {
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

  static create(options: PreprocessorData): PreprocessorData {
    return plainToInstance(PreprocessorDataDto, options);
  }
}
