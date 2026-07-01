import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/mock.test.ts', () => {
  it('should GET /api/mock_get_user', async () => {
    // create app
    const app = await createApp<Framework>();

    // make request
    const result = await createHttpRequest(app).get('/user/mock_get_user');

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK');

    // close app
    await close(app);
  });

});
