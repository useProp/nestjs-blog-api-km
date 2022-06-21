import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegistrationData } from '../dto/uegistrationData.dto';
import { LoginData } from '../dto/loginData.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registration(data: RegistrationData) {
    try {
      const user = this.userRepo.create(data);
      await user.save();
      const token = this.jwtService.sign({ username: data.username });

      return {
        user: {
          ...user,
          token,
        },
      };
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username or Email already taken');
      }
      throw new InternalServerErrorException('Something went wrong :(');
    }
  }

  async login({ email, password }: LoginData) {
    try {
      const user = await this.userRepo.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User is not found');
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new UnauthorizedException('Password is incorrect');
      }

      user.toJSON();

      const token = this.jwtService.sign({ username: user.username });
      return {
        user: {
          ...user,
          token,
        },
      };
    } catch ({ status, message }) {
      throw new HttpException(message, status);
    }
  }

  generateToken(username: string): string {
    return this.jwtService.sign({ username });
  }
}
