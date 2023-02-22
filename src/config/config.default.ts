import { MidwayConfig } from '@midwayjs/core';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'sftz',
  password: 'Zbw574601!!!',
  username: 'root',
});

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1677032927953_459',
  koa: {
    port: 7001,
  },
  sequelize: sequelize,
  // dialect: 'mysql',
  // sequelize: {
  //   dialect: 'mysql',
  //   dataSource: {
  //     default: {
  //       dialect: 'mysql',
  //       host: 'localhost',
  //       port: 3306,
  //       database: 'sftz',
  //       password: 'Zbw574601!!!',
  //       username: 'root',
  //       timezone: '+08:00',
  //       define: {
  //         timestamps: false,
  //         charset: 'utf8',
  //       },
  //       encrypt: true,
  //     },
  //     entities: ['src/entity'],
  //   },
  //   sync: true,
  // },
} as MidwayConfig;
