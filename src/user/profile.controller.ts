import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { GetUser } from '../decorators/getUser.decorator';
import { UserEntity } from '../entities/user.entity';
import { Profile } from '../interfaces/profile.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  async getProfile(@Param('username') username: string): Promise<Profile> {
    const profile = await this.userService.getProfile(username);
    return {
      profile: {
        ...profile,
      },
    } as unknown as Profile;
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Param('username') usernameToFollow: string,
    @GetUser() currentUser: UserEntity,
  ) {
    const profile = await this.userService.follow(
      currentUser,
      usernameToFollow,
    );
    return {
      profile: {
        ...profile,
      },
    };
  }

  @Delete('/:username/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Param('username') username: string,
    @GetUser() currentUser: UserEntity,
  ) {
    const profile = await this.userService.unfollow(currentUser, username);
    return {
      profile: {
        ...profile,
      },
    };
  }
}
