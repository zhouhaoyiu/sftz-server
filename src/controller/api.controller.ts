import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { resultType } from '../type';

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('userHh') userHh: string): Promise<resultType> {
    console.log('userHh', userHh);

    const user = await this.userService.getUser(userHh);
    return { success: true, message: 'OK', data: user };
  }

  @Get('/mock_create_user')
  async mockCreateUser(): Promise<resultType> {
    await this.userService.mockCreateUser();
    return { success: true, message: 'OK' };
  }
  @Get('/mock_get_user')
  async mockGetUser(): Promise<resultType> {
    const user = await this.userService.mockGetUser();
    return { success: true, message: 'OK', data: user };
  }
}
