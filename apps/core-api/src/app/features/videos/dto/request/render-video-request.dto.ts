import { Type } from 'class-transformer';
import {
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
import {
  RenderFrame,
  RenderFrameObject,
  RenderFrameObjectType,
  RenderScene,
  RenderVideoRequest,
} from '../../contracts/request/render-video-request.contract';

export class RenderSceneDto implements RenderScene {
  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;
}

export class RenderFrameDto implements RenderFrame {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RenderFrameObjectDto)
  objects: RenderFrameObjectDto[];
}

export class RenderFrameObjectDto implements RenderFrameObject {
  @IsString()
  id: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  rotation: number;

  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsEnum(RenderFrameObjectType)
  type: RenderFrameObjectType;
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
