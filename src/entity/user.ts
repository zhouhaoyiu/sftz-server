import { Column, Model, Table } from 'sequelize-typescript';

// userId        bigint   用户id
// userName      varchar  用户名
// userWx        varchar  用户微信
// userPhone     varchar  用户手机号
// userJfh       varchar  用户缴费号

@Table
export class User extends Model {
  @Column({ primaryKey: true })
  userId: number;

  @Column
  userName: string;

  @Column
  userWx: string;

  @Column
  userPhone: string;

  @Column
  userJfh: string;
}
