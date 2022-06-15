import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { UserService } from './user.service';
import { GetUser } from '../decorators/getUser.decorator';
import { UserEntity } from '../entities/user.entity';
import { UpdateUser } from '../dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByUsername(@GetUser() { username }: UserEntity) {
    return this.userService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @GetUser() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true, })) data: UpdateUser,
  ) {
    return this.userService.updateUser(username, data);
  }
}
