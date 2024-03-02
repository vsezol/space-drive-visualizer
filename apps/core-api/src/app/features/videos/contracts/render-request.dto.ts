import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  PreprocessorBarrier,
  PreprocessorBullet,
  PreprocessorData,
  PreprocessorFrame,
  PreprocessorObject,
  PreprocessorObjectType,
  PreprocessorScene,
  PreprocessorSpaceship,
  RenderRequest,
  RenderRequestBarrier,
  RenderRequestHistoryItem,
  RenderRequestMap,
  RenderRequestMissile,
  RenderRequestObject,
  RenderRequestObjectType,
  RenderRequestPlayer,
  RenderRequestPlayerInfo,
} from '@space-drive-visualizer/videos-contracts';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  PreprocessorBarrierDto,
  PreprocessorBulletDto,
  PreprocessorDataDto,
  PreprocessorFrameDto,
  PreprocessorSceneDto,
  PreprocessorSpaceshipDto,
} from './preprocessor.dto';
import { stringType } from './string-type';

export class RenderRequestBarrierDto implements RenderRequestBarrier {
  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  x: number;

  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  y: number;

  @IsNumber()
  @ApiProperty({
    example: 20,
  })
  r: number;

  toPreprocessorBarrier(): PreprocessorBarrier {
    return PreprocessorBarrierDto.create({
      x: this.x,
      y: this.y,
      height: this.r,
      width: this.r,
    });
  }
}

export class RenderRequestMapDto implements RenderRequestMap {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 200,
  })
  width: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 200,
  })
  height: number;

  @IsNumber()
  @ApiProperty({
    example: 2323232,
  })
  seed: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RenderRequestBarrierDto)
  @ApiProperty({ type: [RenderRequestBarrierDto] })
  barriers: RenderRequestBarrierDto[];

  mapBarriersToPreprocessorBarriers(): PreprocessorBarrier[] {
    return this.barriers.map((b) => b.toPreprocessorBarrier());
  }

  toPreprocessorScene(): PreprocessorScene {
    return PreprocessorSceneDto.create({
      height: this.height,
      width: this.width,
    });
  }
}

export class RenderRequestPlayerInfoDto implements RenderRequestPlayerInfo {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 3232232,
  })
  id: number;

  @IsString()
  @ApiProperty({
    example: '192.158.1.38',
  })
  ip: string;

  @IsString()
  @ApiProperty({
    example: 'Vsevolod Zolotov',
  })
  name: string;
}

export abstract class RenderRequestObjectDto implements RenderRequestObject {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 3232232,
  })
  id: number;

  @IsEnum(RenderRequestObjectType)
  @ApiProperty({
    type: PreprocessorObjectType,
    example: PreprocessorObjectType.Spaceship,
  })
  object: RenderRequestObjectType;

  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  x: number;

  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  y: number;

  @IsNumber()
  @ApiProperty({
    example: 60,
  })
  direction: number;

  abstract toPreprocessorObject(): PreprocessorObject;
}

export class RenderRequestPlayerDto
  extends RenderRequestObjectDto
  implements RenderRequestPlayer
{
  @IsEnum(RenderRequestObjectType)
  @ApiProperty({
    type: stringType(RenderRequestObjectType.Player),
    example: RenderRequestObjectType.Player,
  })
  object: RenderRequestObjectType.Player;

  @IsNumber()
  @ApiProperty({
    example: 40,
  })
  r: number;

  toPreprocessorObject(): PreprocessorSpaceship {
    return PreprocessorSpaceshipDto.create({
      id: this.id.toString(),
      width: this.r,
      height: this.r,
      x: this.x,
      y: this.y,
      rotation: this.direction,
    });
  }
}

export class RenderRequestMissileDto
  extends RenderRequestObjectDto
  implements RenderRequestMissile
{
  @IsEnum(RenderRequestObjectType)
  @ApiProperty({
    type: stringType(RenderRequestObjectType.Missile),
    example: RenderRequestObjectType.Missile,
  })
  object: RenderRequestObjectType.Missile;

  toPreprocessorObject(): PreprocessorBullet {
    return PreprocessorBulletDto.create({
      id: this.id.toString(),
      radius: 10,
      x: this.x,
      y: this.y,
    });
  }
}

@ApiExtraModels(RenderRequestMissileDto, RenderRequestPlayerDto)
export class RenderRequestHistoryItemDto implements RenderRequestHistoryItem {
  @IsNumber()
  @ApiProperty({
    example: 3232232,
  })
  time: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RenderRequestObjectDto, {
    discriminator: {
      property: 'object',
      subTypes: [
        {
          value: RenderRequestMissileDto,
          name: RenderRequestObjectType.Missile,
        },
        {
          value: RenderRequestPlayerDto,
          name: RenderRequestObjectType.Player,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(RenderRequestMissileDto) },
        { $ref: getSchemaPath(RenderRequestPlayerDto) },
      ],
    },
  })
  objects: RenderRequestObjectDto[];

  toPreprocessorFrame(): PreprocessorFrame {
    return PreprocessorFrameDto.create({
      objects: this.objects.map((x) => x.toPreprocessorObject()),
    });
  }
}

export class RenderRequestDto implements RenderRequest {
  @IsObject()
  @ApiProperty()
  @Type(() => RenderRequestMapDto)
  map: RenderRequestMapDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RenderRequestHistoryItemDto)
  @ApiProperty({ type: [RenderRequestHistoryItemDto] })
  history: RenderRequestHistoryItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [RenderRequestPlayerInfoDto] })
  players: RenderRequestPlayerInfoDto[];

  toPreprocessorData(): PreprocessorData {
    return PreprocessorDataDto.create({
      scene: this.map.toPreprocessorScene(),
      frames: this.history.map((x) => x.toPreprocessorFrame()),
      frameRate: 60,
    });
  }
}
