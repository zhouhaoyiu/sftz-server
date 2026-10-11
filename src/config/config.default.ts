import { User } from './../entity/user';
import { Bill } from '../entity/bill';
import { CustomerChange } from '../entity/customer-change';
import { randomBytes } from 'node:crypto';
import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: process.env.APP_KEYS || randomBytes(32).toString('hex'),
  koa: {
    port: 7001,
  },
  sequelize: {
    dataSource: {
      default: {
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        database: process.env.DB_NAME || 'sftz',
        password: process.env.DB_PASSWORD || '',
        username: process.env.DB_USERNAME || 'root',
        entities: [User, Bill, CustomerChange],
        define: {
          timestamps: false,
        },
        sync: process.env.DB_SYNC === 'true',
        models: [User, Bill, CustomerChange],
      },
    },
    validateOnly: true,
  },
} as MidwayConfig;
