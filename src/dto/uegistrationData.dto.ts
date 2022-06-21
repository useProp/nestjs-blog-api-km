import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrationData {
  @IsString()
  @MinLength(6)
  username: string;

  @IsEmail()
  @IsString()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
