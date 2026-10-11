import { BillingController } from '../src/controller/billing.controller';
import { User } from '../src/entity/user';
import { Bill } from '../src/entity/bill';
import { Context } from '@midwayjs/koa';

jest.mock('../src/security', () => ({
  authorize: () => null,
  session: () => ({ id: 'test-operator' }),
}));
const input = () => ({
  id: '00000000-0000-4000-8000-000000000001',
  userHh: 'DEMO-001',
  period: '2026-10',
  currentNumber: 300,
  expectedLastNumber: 100,
  expectedCurrentNumber: 300,
  population: 3,
  lines: [{ type: '居民一', volume: 200 }],
});
describe('bill persistence', () => {
  const tx = {
    LOCK: { UPDATE: 'UPDATE' },
    commit: jest.fn(),
    rollback: jest.fn(),
  };
  let controller: BillingController;
  let saved: Record<string, unknown> | undefined;
  const user = {
    userHh: 'DEMO-001',
    userName: '示例客户',
    userAddress: '示例街道',
    lastNumber: 100,
    currentNumber: 300,
  };
  beforeEach(() => {
    jest.restoreAllMocks();
    saved = undefined;
    tx.commit.mockClear();
    tx.rollback.mockClear();
    Object.defineProperty(User, 'sequelize', {
      configurable: true,
      value: { transaction: async () => tx },
    });
    jest.spyOn(User, 'findOne').mockResolvedValue(user as User);
    jest
      .spyOn(Bill, 'findByPk')
      .mockImplementation(async () => (saved ?? null) as Bill | null);
    jest.spyOn(Bill, 'create').mockImplementation(async (value) => {
      saved = value;
      return value as Bill;
    });
    controller = new BillingController();
    controller.ctx = { request: { body: input() }, status: 200 } as Context;
  });
  test('retry returns one persisted snapshot without modifying customer readings', async () => {
    const before = JSON.stringify(user);
    const first = await controller.create(),
      retry = await controller.create();
    expect(retry).toEqual(first);
    expect(Bill.create).toHaveBeenCalledTimes(1);
    expect(tx.commit).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(user)).toBe(before);
  });
  test('reused ID with changed content conflicts', async () => {
    await controller.create();
    controller.ctx.request.body = { ...input(), population: 4 };
    expect((await controller.create()).success).toBe(false);
    expect(controller.ctx.status).toBe(409);
    expect(Bill.create).toHaveBeenCalledTimes(1);
  });
  test('stale readings cannot create a bill', async () => {
    jest
      .mocked(User.findOne)
      .mockResolvedValue({ ...user, currentNumber: 301 } as User);
    expect((await controller.create()).success).toBe(false);
    expect(controller.ctx.status).toBe(409);
    expect(Bill.create).not.toHaveBeenCalled();
    expect(tx.rollback).toHaveBeenCalledTimes(1);
  });
  test('storage failure rolls back and propagates failure', async () => {
    jest
      .mocked(Bill.create)
      .mockRejectedValue(new Error('storage unavailable'));
    await expect(controller.create()).rejects.toThrow('storage unavailable');
    expect(tx.rollback).toHaveBeenCalledTimes(1);
    expect(tx.commit).not.toHaveBeenCalled();
  });
  test('malformed ID rejected before persistence', async () => {
    controller.ctx.request.body = { ...input(), id: '-'.repeat(36) };
    expect((await controller.create()).success).toBe(false);
    expect(controller.ctx.status).toBe(400);
    expect(User.findOne).not.toHaveBeenCalled();
  });
  test('reprint reads the stored snapshot only', async () => {
    await controller.create();
    const stored = saved;
    await controller.get(input().id);
    await controller.get(input().id);
    expect(saved).toBe(stored);
    expect(Bill.create).toHaveBeenCalledTimes(1);
  });
});
