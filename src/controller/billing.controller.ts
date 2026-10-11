import { Controller, Inject, Get, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { createHash } from 'node:crypto';
import { authorize, session } from '../security';
import { calculateBill, tariffs, tariffVersion, Line } from '../billing';
import { User } from '../entity/user';
import { Bill } from '../entity/bill';
@Controller('/billing')
export class BillingController {
  @Inject() ctx: Context;
  @Get('/tariffs') async rates() {
    const denied = authorize(this.ctx);
    if (denied) return denied;
    return {
      success: true,
      data: { tariffVersion, categories: Object.keys(tariffs) },
    };
  }
  @Get('/bill') async get(@Query('id') id: string) {
    const denied = authorize(this.ctx);
    if (denied) return denied;
    const bill = await Bill.findByPk(id);
    if (!bill) {
      this.ctx.status = 404;
      return { success: false, message: 'Bill not found' };
    }
    return { success: true, data: JSON.parse(bill.snapshot) };
  }
  @Get('/history') async history(@Query('userHh') userHh: string) {
    const denied = authorize(this.ctx);
    if (denied) return denied;
    if (!userHh) {
      this.ctx.status = 400;
      return { success: false };
    }
    const bills = await Bill.findAll({
      where: { userHh },
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    return {
      success: true,
      data: bills.map((bill) => JSON.parse(bill.snapshot)),
    };
  }
  @Post('/bill') async create() {
    const denied = authorize(this.ctx);
    if (denied) return denied;
    const input = this.ctx.request.body as {
      id: string;
      userHh: string;
      period: string;
      currentNumber: number;
      expectedLastNumber: number;
      expectedCurrentNumber: number;
      lines: Line[];
      population: number;
    };
    let calculation: ReturnType<typeof calculateBill>;
    try {
      if (
        !input ||
        typeof input.id !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          input.id
        ) ||
        typeof input.userHh !== 'string' ||
        !input.userHh ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(input.period) ||
        typeof input.currentNumber !== 'number' ||
        !Number.isFinite(input.currentNumber) ||
        !Number.isFinite(input.expectedLastNumber) ||
        !Number.isFinite(input.expectedCurrentNumber)
      )
        throw new Error('Invalid bill');
      calculation = calculateBill(input.lines, input.population);
      if (
        Math.abs(
          input.currentNumber -
            input.expectedLastNumber -
            calculation.totalVolume
        ) > 0.000001
      )
        throw new Error('Usage mismatch');
    } catch {
      this.ctx.status = 400;
      return { success: false, message: '请核对读数、人口、月份及分类用量' };
    }
    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          userHh: input.userHh,
          period: input.period,
          currentNumber: input.currentNumber,
          expectedLastNumber: input.expectedLastNumber,
          expectedCurrentNumber: input.expectedCurrentNumber,
          calculation,
        })
      )
      .digest('hex');
    const transaction = await User.sequelize!.transaction();
    try {
      const user = await User.findOne({
        where: { userHh: input.userHh, archived: false },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!user) {
        await transaction.rollback();
        this.ctx.status = 404;
        return { success: false, message: '用户不存在' };
      }
      const existing = await Bill.findByPk(input.id, { transaction });
      if (existing) {
        await transaction.rollback();
        if (existing.requestHash !== hash) {
          this.ctx.status = 409;
          return { success: false, message: '该提交编号已使用' };
        }
        return { success: true, data: JSON.parse(existing.snapshot) };
      }
      if (
        Number(user.lastNumber) !== input.expectedLastNumber ||
        Number(user.currentNumber) !== input.expectedCurrentNumber
      ) {
        await transaction.rollback();
        this.ctx.status = 409;
        return { success: false, message: '客户读数已更新，请重新查询' };
      }
      const createdAt = new Date();
      const snapshot = {
        id: input.id,
        userHh: user.userHh,
        userName: user.userName,
        userAddress: user.userAddress,
        period: input.period,
        lastNumber: Number(user.lastNumber),
        currentNumber: input.currentNumber,
        createdAt: createdAt.toISOString(),
        ...calculation,
      };
      await Bill.create(
        {
          id: input.id,
          userHh: input.userHh,
          requestHash: hash,
          snapshot: JSON.stringify(snapshot),
          createdBy: session(this.ctx)!.id,
          createdAt,
        },
        { transaction }
      );
      await transaction.commit();
      return { success: true, data: snapshot };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
