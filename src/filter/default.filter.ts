import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.status = err instanceof TypeError ? 400 : 500;
    return {
      success: false,
      message: err instanceof TypeError ? '请求参数错误' : '服务暂时不可用',
    };
  }
}
