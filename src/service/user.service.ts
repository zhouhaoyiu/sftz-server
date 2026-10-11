import { Provide } from '@midwayjs/core';
import { randomUUID } from 'node:crypto';
import { User } from '../entity/user';
import { CustomerChange } from '../entity/customer-change';
import { customerInput } from '../customer';
export class CustomerConflict extends Error {}
@Provide()
export class UserService {
  async getUser(userHh: string) {
    return User.findOne({
      where: { userHh, archived: false },
      attributes: { exclude: ['userPhone', 'userWx'] },
    });
  }
  async getAllUser() {
    return User.findAll({
      where: { archived: false },
      order: [['userHh', 'ASC']],
    });
  }
  async getUserCount() {
    return User.count({ where: { archived: false } });
  }
  async createUser(body: unknown, actor: string) {
    const data = customerInput(body);
    return User.sequelize!.transaction(async (transaction) => {
      if (
        await User.findOne({
          where: { userHh: data.userHh },
          transaction,
          lock: transaction.LOCK.UPDATE,
        })
      )
        throw new CustomerConflict('户号已存在');
      const user = await User.create(
        { ...data, version: 1, archived: false },
        { transaction }
      );
      await CustomerChange.create(
        {
          id: randomUUID(),
          userHh: data.userHh,
          actor,
          action: '创建',
          beforeData: 'null',
          afterData: JSON.stringify(data),
          reason: '',
          createdAt: new Date(),
        },
        { transaction }
      );
      return user;
    });
  }
  async updateUser(body: unknown, actor: string) {
    const input = body as Record<string, unknown>;
    const data = customerInput(body);
    if (!Number.isInteger(input.version)) throw new TypeError('缺少记录版本');
    return User.sequelize!.transaction(async (transaction) => {
      const user = await User.findOne({
        where: { userHh: data.userHh, archived: false },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!user || user.version !== input.version)
        throw new CustomerConflict('客户资料已更新，请重新读取');
      const before = user.toJSON();
      await user.update(
        { ...data, version: user.version + 1 },
        { transaction }
      );
      await CustomerChange.create(
        {
          id: randomUUID(),
          userHh: data.userHh,
          actor,
          action: '修改',
          beforeData: JSON.stringify(before),
          afterData: JSON.stringify(data),
          reason: '',
          createdAt: new Date(),
        },
        { transaction }
      );
      return user;
    });
  }
  async archive(body: unknown, actor: string) {
    const input = body as Record<string, unknown>;
    if (
      !input ||
      typeof input.userHh !== 'string' ||
      !Number.isInteger(input.version) ||
      typeof input.reason !== 'string' ||
      !input.reason.trim() ||
      input.reason.length > 2000
    )
      throw new TypeError('请填写归档原因');
    return User.sequelize!.transaction(async (transaction) => {
      const user = await User.findOne({
        where: { userHh: input.userHh, archived: false },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!user || user.version !== input.version)
        throw new CustomerConflict('客户资料已更新，请重新读取');
      const before = user.toJSON();
      await user.update(
        { archived: true, version: user.version + 1 },
        { transaction }
      );
      await CustomerChange.create(
        {
          id: randomUUID(),
          userHh: input.userHh,
          actor,
          action: '归档',
          beforeData: JSON.stringify(before),
          afterData: 'null',
          reason: input.reason,
          createdAt: new Date(),
        },
        { transaction }
      );
    });
  }
}
