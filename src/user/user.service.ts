import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUser } from '../dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException('User is not found');
      }

      return user;
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async updateUser(username: string, data: UpdateUser) {
    try {
      await this.userRepo.update({ username }, data);
      const user = await this.userRepo.findOne({ where: { username } });
      return user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
