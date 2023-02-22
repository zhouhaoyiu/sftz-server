import { Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { User } from '../entity/user';

@Provide()
export class UserService {
  async getUser(userId: number): Promise<IUserOptions> {
    return await User.findOne({ where: { userId } });
  }
  async mockGetUser(): Promise<IUserOptions> {
    return {
      userId: 1,
      userName: '张三',
      userWx: 'zhangsan',
      userPhone: '12345678901',
      userJfh: '12345678901234567890',
    };
  }
  async getAllUser(): Promise<IUserOptions[]> {
    return await User.findAll();
  }

  async mockCreateUser(): Promise<void> {
    const userList = [
      {
        userId: 1,
        userName: '张三',
        userWx: 'zhangsan',
        userPhone: '12345678901',
        userJfh: '12345678901234567890',
      },
      {
        userId: 2,
        userName: '李四',
        userWx: 'lisi',
        userPhone: '12345678902',
        userJfh: '12345678901234567891',
      },
    ];
    userList.forEach(async user => {
      await User.create(user);
    });
  }
}
