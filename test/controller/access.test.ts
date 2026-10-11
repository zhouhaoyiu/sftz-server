import { APIController } from '../../src/controller/api.controller';
import { Context } from '@midwayjs/koa';
describe('customer authorization', () => {
  test('query rejects unauthenticated callers before accessing data', async () => {
    const controller = new APIController();
    const ctx = { get: () => '', status: 200 };
    controller.ctx = ctx as unknown as Context;
    expect((await controller.getUser('test')).success).toBe(false);
    expect(ctx.status).toBe(401);
  });
  test('production controller has no fixture-writing routes', () => {
    expect('mockCreateUser' in APIController.prototype).toBe(false);
    expect('mockGetUser' in APIController.prototype).toBe(false);
  });
});
