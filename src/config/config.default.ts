import { User } from './../entity/user';
import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1677032927953_459',
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
        password: 'Zbw574601!!!',
        username: 'root',
        entities: [User],
        define: {
          timestamps: false,
        },
      },
    },
  },
} as MidwayConfig;
