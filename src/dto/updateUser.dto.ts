import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUser {
  @IsEmail()
  @IsString()
  @MinLength(6)
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(150)
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  image: string | null;
}
