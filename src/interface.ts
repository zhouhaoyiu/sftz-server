/**
 * @description User-Service parameters
 */
// userId        bigint   用户id
// userName      varchar  用户名
// userWx        varchar  用户微信
// userPhone     varchar  用户手机号
// userJfh       varchar  用户缴费号
export interface IUserOptions {
  userId: number;
  userName: string;
  userWx: string;
  userPhone: string;
  userJfh: string;
}
