import { getUuid } from '@space-drive-visualizer/utils';
import {
  Barrier,
  Bullet,
  ColorRGB,
  ColorRGBA,
  Flame,
  Highlight,
  RenderFrame,
  RenderObject,
  RenderObjectType,
  RenderScene,
  RenderVideoRequest,
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

export class RenderSceneDto implements RenderScene {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;
}

export class RenderObjectDto implements RenderObject {
  @IsString()
  id: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsEnum(RenderObjectType)
  type: RenderObjectType;
}

export class SpaceshipDto extends RenderObjectDto implements Spaceship {
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

export class BulletDto extends RenderObjectDto implements Bullet {
  @IsInt()
  @IsPositive()
  radius: number;

  @IsArray()
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @IsInt({ each: true })
  color: ColorRGB;
}

export class BarrierDto extends RenderObjectDto implements Barrier {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;
}

export class FlameDto extends RenderObjectDto implements Flame {
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
      type: RenderObjectType.Flame,
      ...options,
    });
  }
}

export class HighlightDto extends RenderObjectDto implements Highlight {
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
      type: RenderObjectType.Highlight,
      ...options,
    });
  }
}

export class RenderFrameDto implements RenderFrame {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RenderObjectDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: SpaceshipDto, name: RenderObjectType.Spaceship },
        { value: BarrierDto, name: RenderObjectType.Barrier },
        { value: BulletDto, name: RenderObjectType.Bullet },
        { value: FlameDto, name: RenderObjectType.Flame },
        { value: HighlightDto, name: RenderObjectType.Highlight },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  objects: (SpaceshipDto | BarrierDto | BulletDto | FlameDto | HighlightDto)[]; // TODO check by base class
}

export class RenderVideoRequestDto implements RenderVideoRequest {
  @IsObject()
  scene: RenderSceneDto;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RenderFrameDto)
  frames: RenderFrameDto[];

  @IsInt()
  @Min(1)
  @Max(120)
  frameRate: number;
}
