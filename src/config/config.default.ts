import { User } from './../entity/user';
import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '***REMOVED_COOKIE_KEY***',
  koa: {
    port: 7001,
  },
  sequelize: {
    dataSource: {
      default: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'sftz',
        password: '***REMOVED_DB_PASSWORD***!!',
        username: 'root',
        entities: [User],
        define: {
          timestamps: false,
        },
        sync: true,
        models: [User],
      },
    },
    validateOnly: true,
  },
} as MidwayConfig;
