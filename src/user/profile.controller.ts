import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { GetUser } from '../decorators/getUser.decorator';
import { UserEntity } from '../entities/user.entity';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    const profile = await this.userService.findByUsername(username);
    return {
      profile: {
        ...profile,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:username/follow')
  async followUser(
    @Param('username') username: string,
    @GetUser() currentUser: UserEntity,
  ) {
    const profile = await this.userService.followUser(currentUser, username);
    return {
      profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:username/follow')
  async unfollowUser(
    @Param('username') username: string,
    @GetUser() currentUser: UserEntity,
  ) {
    const profile = await this.userService.unfollowUser(currentUser, username);
    return {
      profile,
    };
  }
}
