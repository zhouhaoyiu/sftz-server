/**
 * userId                  用户ID
 * userHh                  户号
 * jfyf                    缴费月份
 * userName                用户名
 * userAddress             地址
 * currentNumber           本次指数
 * lastNumber              上次指数
 * latestPaymentDate       最迟缴费日期
 * userTotalUse            总用量
 * userPhone               用户电话
 * userWx                  用户微信
 */
export interface IUserOptions {
  userId?: number;
  userHh: string;
  jfyf: string;
  userName: string;
  userAddress: string;
  currentNumber: number;
  lastNumber: number;
  latestPaymentDate: string;
  userTotalUse: number;
  userPhone: string;
  userWx: string;
}
