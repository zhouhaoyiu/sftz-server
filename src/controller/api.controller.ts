import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('userId') userId) {
    const user = await this.userService.getUser(userId);
    return { success: true, message: 'OK', data: user };
  }

  @Get('/mock_create_user')
  async mockCreateUser() {
    await this.userService.mockCreateUser();
    return { success: true, message: 'OK' };
  }
  @Get('/mock_get_user')
  async mockGetUser() {
    const user = await this.userService.mockGetUser();
    return { success: true, message: 'OK', data: user };
  }
}
