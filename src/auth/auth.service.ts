import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { RegistrationData } from '../dto/RegistrationData.dto';
import { LoginData } from '../LoginData.dto';

@Injectable()
export class AuthService {
  private user = {
    email: 'test@test.com',
    username: 'First User',
    password: '123456',
    token: 'jwt.token',
    bio: 'Something about Me will be here :)',
    image: null,
  };

  registration(data: RegistrationData) {
    return this.user;
  }

  login(data: LoginData) {
    if (data.email !== this.user.email) {
      throw new InternalServerErrorException();
    }

    return this.user;
  }
}
