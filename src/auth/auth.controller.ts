import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationData } from '../dto/RegistrationData.dto';
import { LoginData } from '../dto/LoginData.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  registration(@Body(ValidationPipe) registrationData: RegistrationData) {
    return this.authService.registration(registrationData);
  }

  @Post('/login')
  login(@Body(ValidationPipe) loginData: LoginData) {
    return this.authService.login(loginData);
  }
}
