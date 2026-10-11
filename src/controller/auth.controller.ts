import { Controller, Inject, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { login, logout } from '../security';
@Controller('/auth')
export class AuthController {
  @Inject() ctx: Context;
  @Post('/login') async signIn() {
    const body = this.ctx.request.body as {
      username: string;
      password: string;
    };
    const result = login(body?.username, body?.password, this.ctx.ip);
    if (!result) {
      this.ctx.status = 401;
      return { success: false, message: 'Invalid credentials' };
    }
    return { success: true, message: 'OK', data: result };
  }
  @Post('/logout') async signOut() {
    logout(this.ctx);
    return { success: true, message: 'OK' };
  }
}
