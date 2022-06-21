import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  body: string;
}
