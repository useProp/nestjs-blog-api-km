import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUser } from '../dto/updateUser.dto';
import { AuthService } from '../auth/auth.service';
import { Profile } from '../interfaces/profile.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async findByUsername(
    username: string,
  ): Promise<{ user: UserEntity; token: string }> {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException('User is not found');
      }

      const token = this.authService.generateToken(username);

      user.toJSON();

      return {
        user,
        token,
      };
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async updateUser(
    username: string,
    data: UpdateUser,
  ): Promise<{ user: UserEntity; token: string }> {
    try {
      await this.userRepo.update({ username }, data);
      const user = await this.userRepo.findOne({ where: { username } });

      const token = this.authService.generateToken(username);

      return {
        user,
        token,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async follow(
    currentUser: UserEntity,
    usernameToFollow: string,
  ): Promise<Profile> {
    try {
      const userToFollow = await this.userRepo.findOne({
        where: { username: usernameToFollow },
        relations: ['followers'],
      });

      if (!userToFollow) {
        throw new NotFoundException('User is not found');
      }

      if (currentUser.id === userToFollow.id) {
        throw new ConflictException('You can not subscribe on yourself :)');
      }

      return currentUser.followTo(userToFollow);
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async unfollow(
    currentUser: UserEntity,
    usernameForUnfollow: string,
  ): Promise<Profile> {
    try {
      const userForUnfollow = await this.userRepo.findOne({
        where: { username: usernameForUnfollow },
        relations: ['followers'],
      });

      if (!userForUnfollow) {
        throw new NotFoundException('User is not found');
      }

      if (currentUser.id === userForUnfollow.id) {
        throw new ConflictException('You can not unsubscribe from yourself :)');
      }

      return currentUser.unfollowFrom(userForUnfollow);
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async getProfile(username: string): Promise<Profile> {
    try {
      const user = await this.userRepo.findOne({
        where: { username },
        relations: ['followers'],
      });
      if (!user) {
        throw new NotFoundException('User is not found');
      }

      return user.getProfile(user);
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }
}
