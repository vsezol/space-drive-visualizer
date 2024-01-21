import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import {
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

export class RenderFrameDto implements RenderFrameDto {
  @IsArray()
  objects: RenderFrameObject[];
}

export class RenderFrameObjectDto implements RenderFrameObject {
  @IsNumber()
  @IsPositive()
  x: number;

  @IsNumber()
  @IsPositive()
  y: number;

  @IsNumber()
  @Min(0)
  @Max(360)
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
  frames: RenderFrameDto[];

  @IsInt()
  @Min(1)
  @Max(120)
  frameRate: number;
}
