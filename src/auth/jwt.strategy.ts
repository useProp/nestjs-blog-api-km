import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthPayload } from '../interfaces/AuthPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: process.env.SECRET,
    });
  }

  async validate({ username }: AuthPayload) {
    const user = await this.userRepo.findOne({ where: { username } });
    console.log(12312)

    if (!user) {
      console.log(123123111)
      throw new UnauthorizedException();
    }

    return user;
  }
}
