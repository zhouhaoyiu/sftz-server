import { Column, Model, Table } from 'sequelize-typescript';

/**
 * userId                  用户ID
 * userHh                  户号
 * jfyf                    缴费月份
 * userName                用户名
 * userAddress             地址
 * currentNumber           本次指数
 * lastNumber              上次指数
 * latestPaymentDate       最迟缴费日期
 * userPopulation          用户人数
 * userPhone               用户电话
 * userWx                  用户微信
 * waterClassification     用水分类
 */

@Table
export class User extends Model {
  @Column({ primaryKey: true })
  userId: number;

  @Column
  userHh: string;

  @Column
  jfyf: string;

  @Column
  userName: string;

  @Column
  userAddress: string;

  @Column
  currentNumber: number;

  @Column
  lastNumber: number;

  @Column
  latestPaymentDate: string;

  @Column
  userPopulation: number;

  @Column
  userPhone: string;

  @Column
  userWx: string;

  @Column
  waterClassification: string;
}
