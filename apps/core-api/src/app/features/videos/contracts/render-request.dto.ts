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

export class SceneDto implements Scene {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;
}

export class BaseObjectDto implements BaseObject {
  @IsString()
  id: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsEnum(ObjectType)
  type: ObjectType;
}

export class SpaceshipDto extends BaseObjectDto implements Spaceship {
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
}

export class BulletDto extends BaseObjectDto implements Bullet {
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  color: ColorRGB;
}

export class BarrierDto extends BaseObjectDto implements Barrier {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;
}

export class FlameDto extends BaseObjectDto implements Flame {
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  color: ColorRGBA;

  static create(options: Omit<FlameDto, 'id' | 'type'>): FlameDto {
    return plainToInstance<FlameDto, FlameDto>(FlameDto, {
      id: getUuid(),
      type: ObjectType.Flame,
      ...options,
    });
  }
}

export class HighlightDto extends BaseObjectDto implements Highlight {
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(4)
  @ArrayMinSize(4)
  @IsNumber({}, { each: true })
  color: ColorRGBA;

  static create(options: Omit<HighlightDto, 'id' | 'type'>): HighlightDto {
    return plainToInstance<HighlightDto, HighlightDto>(HighlightDto, {
      id: getUuid(),
      type: ObjectType.Highlight,
      ...options,
    });
  }
}

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
        { value: FlameDto, name: ObjectType.Flame },
        { value: HighlightDto, name: ObjectType.Highlight },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  objects: BaseObjectDto[];
}

export class RenderRequestDto implements RenderRequest {
  @IsObject()
  scene: SceneDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FrameDto)
  frames: FrameDto[];

  @IsInt()
  @Min(1)
  @Max(120)
  frameRate: number;
}
