import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ColorRGB, ColorRGBA, getUuid } from '@space-drive-visualizer/utils';
import {
  Barrier,
  BaseObject,
  Bullet,
  Flame,
  Frame,
  Highlight,
  ObjectType,
  RenderRequest,
  Scene,
  Spaceship,
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

const stringType = (value: unknown) => `"${value}"`;

export class SceneDto implements Scene {
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
}

export class BaseObjectDto implements BaseObject {
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

export class SpaceshipDto extends BaseObjectDto implements Spaceship {
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

  @IsEnum(ObjectType)
  @ApiProperty({
    type: stringType(ObjectType.Spaceship),
    example: ObjectType.Spaceship,
  })
  type: ObjectType.Spaceship;
}

export class BulletDto extends BaseObjectDto implements Bullet {
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

  @IsEnum(ObjectType)
  @ApiProperty({
    type: stringType(ObjectType.Bullet),
    example: ObjectType.Bullet,
  })
  type: ObjectType.Bullet;
}

export class BarrierDto extends BaseObjectDto implements Barrier {
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

  @IsEnum(ObjectType)
  @ApiProperty({
    type: stringType(ObjectType.Barrier),
    example: ObjectType.Barrier,
  })
  type: ObjectType.Barrier;
}

export class FlameDto extends BaseObjectDto implements Flame {
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

  static create(options: Omit<FlameDto, 'id'>): FlameDto {
    return plainToInstance<FlameDto, FlameDto>(FlameDto, {
      id: getUuid(),
      ...options,
    });
  }
}

export class HighlightDto extends BaseObjectDto implements Highlight {
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

  static create(options: Omit<HighlightDto, 'id'>): HighlightDto {
    return plainToInstance<HighlightDto, HighlightDto>(HighlightDto, {
      id: getUuid(),
      ...options,
    });
  }
}

@ApiExtraModels(SpaceshipDto, BarrierDto, BulletDto)
export class FrameDto implements Frame {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BaseObjectDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: SpaceshipDto, name: ObjectType.Spaceship },
        { value: BarrierDto, name: ObjectType.Barrier },
        { value: BulletDto, name: ObjectType.Bullet },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SpaceshipDto) },
        { $ref: getSchemaPath(BarrierDto) },
        { $ref: getSchemaPath(BulletDto) },
      ],
    },
  })
  objects: BaseObjectDto[];
}

export class RenderRequestDto implements RenderRequest {
  @IsObject()
  @ApiProperty()
  scene: SceneDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FrameDto)
  @ApiProperty({ type: [FrameDto] })
  frames: FrameDto[];

  @IsInt()
  @Min(1)
  @Max(120)
  @ApiProperty({
    example: 24,
  })
  frameRate: number;
}
