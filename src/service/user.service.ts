import { Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { User } from '../entity/user';
/**
 * userId                  用户ID
 * userHh                  户号
 * jfyf                    缴费月份
 * userName                用户名
 * userAddress             地址
 * currentNumber           本次指数
 * lastNumber              上次指数
 * latestPaymentDate       最迟缴费日期
 * userPopulation          用户人数
 * userPhone               用户电话
 * userWx                  用户微信
 * waterClassification     用水分类
 */
@Provide()
export class UserService {
  async getUser(userHh: string): Promise<IUserOptions> {
    return await User.findOne({ where: { userHh } });
  }
  async mockGetUser(): Promise<IUserOptions> {
    return {
      userId: 1,
      userHh: '123456',
      jfyf: '2023-02',
      userName: '张三',
      userAddress: '北京市海淀区',
      currentNumber: 0,
      lastNumber: 123,
      latestPaymentDate: '2023-03-15',
      userPopulation: 3,
      userPhone: '12345678901',
      userWx: 'zhangsan',
      waterClassification: '居民一',
    };
  }
  async getAllUser(): Promise<IUserOptions[]> {
    return await User.findAll();
  }

  async updateUserByUserHh(
    userHh: string,
    rest: any
  ): Promise<[affectedCount: number]> {
    return await User.update(rest, { where: { userHh } });
  }

  async mockCreateUser(): Promise<User[]> {
    const userList: IUserOptions[] = [
      {
        userHh: '123456',
        jfyf: '2023-02',
        userName: '张三',
        userAddress: '北京市海淀区',
        currentNumber: 0,
        lastNumber: 123,
        latestPaymentDate: '2023-03-15',
        userPopulation: 3,
        userPhone: '12345678901',
        userWx: 'zhangsan',
        waterClassification: '居民一,生活一',
      },
      {
        userHh: '789012',
        jfyf: '2023-02',
        userName: '李四',
        userAddress: '北京市朝阳区',
        currentNumber: 0,
        lastNumber: 456,
        latestPaymentDate: '2023-03-15',
        userPopulation: 3,
        userPhone: '188117111111',
        userWx: 'lisi',
        waterClassification: '特种一,生活一',
      },
    ];
    return await User.bulkCreate(userList as any);
  }
}
