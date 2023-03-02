import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
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

  @Get('/get_all_user')
  async getAllUser(): Promise<resultType> {
    const user = await this.userService.getAllUser();
    return { success: true, message: 'OK', data: user };
  }

  @Post('/update_user_by_userHh')
  async updateUserByUserHh(): Promise<resultType> {
    const { userHh, ...rest } = this.ctx.request.body as any;
    const user = await this.userService.updateUserByUserHh(userHh, rest);
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
