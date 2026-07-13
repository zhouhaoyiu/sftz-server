import { Configuration, App, ILifeCycle } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as sequelize from '@midwayjs/sequelize';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import cors = require('@koa/cors');

@Configuration({
  imports: [
    koa,
    validate,
    sequelize,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);
    // add middleware
    const corsMiddleware = cors({
      origin: ctx => {
        const origin = ctx.get('Origin');
        return origin && allowedOrigins.includes(origin) ? origin : '';
      },
    }) as unknown as Parameters<typeof this.app.use>[0];
    this.app.use(corsMiddleware);
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
