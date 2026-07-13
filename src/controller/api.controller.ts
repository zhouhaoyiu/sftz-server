import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { resultType } from '../type';
import { IUserOptions } from '../interface';

type UserMutationBody = Partial<IUserOptions> & {
  editUserHh?: string;
};

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  private requireAdmin(): resultType | null {
    const token = process.env.SFTZ_ADMIN_TOKEN;
    if (!token || this.ctx.get('x-admin-token') !== token) {
      this.ctx.status = 401;
      return { success: false, message: 'Unauthorized' };
    }
    return null;
  }

  @Get('/get_user')
  async getUser(@Query('userHh') userHh: string): Promise<resultType> {
    console.log('userHh', userHh);

    const user = await this.userService.getUser(userHh);
    return { success: true, message: 'OK', data: user };
  }

  @Get('/get_all_user')
  async getAllUser(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const user = await this.userService.getAllUser();
    return { success: true, message: 'OK', data: user };
  }

  @Post('/update_user_by_userHh')
  async updateUserByUserHh(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const { editUserHh = '', ...rest } = this.ctx.request
      .body as UserMutationBody;
    console.log('userHh', editUserHh);
    const user = await this.userService.updateUserByUserHh(editUserHh, rest);
    return { success: true, message: 'OK', data: user };
  }

  @Post('/save_user_new_info_to_DB')
  async saveUserNewInfoToDB(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const { editUserHh = '', ...rest } = this.ctx.request
      .body as UserMutationBody;
    console.log('userHh', editUserHh);
    const user = await this.userService.saveUserNewInfoToDB(editUserHh, rest);
    return { success: true, message: 'OK', data: user };
  }

  @Post('/create_user')
  async createUser(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const { userHh = '', ...rest } = this.ctx.request.body as UserMutationBody;

    const user = await this.userService.createUser(userHh, rest);
    return { success: true, message: 'OK', data: user };
  }

  @Post('/delete_user_by_userHh')
  async deleteUserByUserHh(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const { userHh = '' } = this.ctx.request.body as UserMutationBody;
    const user = await this.userService.deleteUserByUserHh(userHh);
    return { success: true, message: 'OK', data: user };
  }

  @Post('update_waterClassification_by_userHh')
  async updateWaterClassificationByUserHh(): Promise<resultType> {
    const denied = this.requireAdmin();
    if (denied) return denied;
    const { userHh = '', waterClassification = '' } = this.ctx.request
      .body as UserMutationBody;
    const user = await this.userService.updateWaterClassificationByUserHh(
      userHh,
      waterClassification
    );
    return { success: true, message: 'OK', data: user };
  }

  @Get('/get_user_count')
  async getUserCount(): Promise<resultType> {
    const user = await this.userService.getUserCount();
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
