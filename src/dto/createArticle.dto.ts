import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateArticleDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagList: string[];
}
