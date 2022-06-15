import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return {
      profile: {
        ...user,
      },
    };
  }
}
