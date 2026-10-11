# 水费通知服务

`pnpm install --frozen-lockfile`，`pnpm test`，`pnpm build`。

环境变量：`DB_HOST`、`DB_PORT`、`DB_NAME`、`DB_USERNAME`、`DB_PASSWORD`、`APP_USERS_FILE`、`CORS_ORIGINS`。不要在生产环境开启 `DB_SYNC`。

运行 `python3 scripts/create-account.py username --role admin` 生成账号条目；将条目放入服务器私有 JSON 数组文件，权限设为 600，使用 `APP_USERS_FILE` 指向它。普通操作员使用 staff，客户档案管理使用 admin。客户端登录后使用 8 小时 Bearer 会话；重启服务会注销全部会话。生产环境使用 HTTPS。

备份数据库后依次执行 `migrations/001_bills.sql`、`migrations/002_customer_history.sql`。第二份迁移使用原模型对应的 `Users` 表名，执行前以 `SHOW TABLES` 核对大小写，并排查重复户号。客户修改使用版本校验，归档保留原记录和操作历史。

账单包含客户与读数快照、分类明细、计价版本和制单人；生成及补打均不修改客户读数。同一请求 ID 重试返回原账单，换内容时拒绝复用 ID。

`legacy-v1` 沿用原仓库计价参数，修复计算与打印分叉。正式启用前由业务负责人核对适用周期、人口及价格参数；调整价格时新增版本并保留既有账单。测试只验证现有算法的一致性，不连接业务数据库。
