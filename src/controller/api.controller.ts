import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService, CustomerConflict } from '../service/user.service';
import { resultType } from '../type';
import { authorize, session } from '../security';

@Controller('/user')
export class APIController {
  @Inject() ctx: Context;
  @Inject() userService: UserService;
  @Get('/get_user') async getUser(
    @Query('userHh') userHh: string
  ): Promise<resultType> {
    const denied = authorize(this.ctx);
    if (denied) return denied;
    if (!userHh || userHh.length > 128) {
      this.ctx.status = 400;
      return { success: false, message: '户号格式错误' };
    }
    return {
      success: true,
      message: 'OK',
      data: await this.userService.getUser(userHh),
    };
  }
  @Get('/get_all_user') async getAllUser(): Promise<resultType> {
    const denied = authorize(this.ctx, true);
    if (denied) return denied;
    return {
      success: true,
      message: 'OK',
      data: await this.userService.getAllUser(),
    };
  }
  @Get('/get_user_count') async getUserCount(): Promise<resultType> {
    const denied = authorize(this.ctx, true);
    if (denied) return denied;
    return {
      success: true,
      message: 'OK',
      data: await this.userService.getUserCount(),
    };
  }
  private async mutate(
    action: 'createUser' | 'updateUser' | 'archive'
  ): Promise<resultType> {
    const denied = authorize(this.ctx, true);
    if (denied) return denied;
    try {
      return {
        success: true,
        message: 'OK',
        data: await this.userService[action](
          this.ctx.request.body,
          session(this.ctx)!.id
        ),
      };
    } catch (error) {
      if (error instanceof CustomerConflict || error instanceof TypeError) {
        this.ctx.status = error instanceof CustomerConflict ? 409 : 400;
        return { success: false, message: error.message };
      }
      throw error;
    }
  }
  @Post('/create_user') createUser() {
    return this.mutate('createUser');
  }
  @Post('/update_user_by_userHh') updateUserByUserHh() {
    return this.mutate('updateUser');
  }
  @Post('/save_user_new_info_to_DB') saveUserNewInfoToDB() {
    return this.mutate('updateUser');
  }
  @Post('/delete_user_by_userHh') deleteUserByUserHh() {
    return this.mutate('archive');
  }
}
