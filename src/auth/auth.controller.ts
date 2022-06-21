import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationData } from '../dto/uegistrationData.dto';
import { LoginData } from '../dto/loginData.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  registration(
    @Body(ValidationPipe) registrationData: { user: RegistrationData },
  ) {
    return this.authService.registration(registrationData.user);
  }

  @Post('/login')
  login(@Body(ValidationPipe) loginData: { user: LoginData }) {
    return this.authService.login(loginData.user);
  }
}
