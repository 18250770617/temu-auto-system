# Temu 合规中心模板扩展

这个 MV3 扩展用于 `https://agentseller.temu.com/govern/information-supplementation`：

- 打开商品“编辑合规信息”抽屉后，在底部插入“设为模板”按钮。
- 保存当前商品的合规字段、`query_detail` 接口快照、提交草稿和店铺归属到本地 Postgres。
- 在模板列表中查看 JSON、删除模板、对当前商品执行“演练更改”。
- 演练只调用 `query_dynamic_template` 和 `check_edit_compliance`；真实 `edit_compliance` 必须点击“真实保存”并通过浏览器二次确认。

## 本地 API

在 `D:\auto-system` 启动：

```powershell
npm run migrate:compliance-template
npm run dev:api
```

默认配置：

- API: `http://127.0.0.1:8787`
- DB: `postgres://postgres:postgres@127.0.0.1:5432/ecommerce_aggregation`
- 用 `COMPLIANCE_TEMPLATE_API_PORT` 或 `PORT` 覆盖端口。
- 用 `DATABASE_URL` 覆盖数据库连接。

本地 API 使用：

- `ComplianceInfoTemplate` 保存模板。
- `Shop` 解析店铺归属。
- `PluginCookieHeader` 读取当前 Temu 会话的 `cookieHeader`、`mallId`、`siteKey`、`sourceOrigin`，仅用于发起 Temu 请求，不写入日志或文档。

## 加载扩展

1. 打开 `chrome://extensions/`。
2. 开启 Developer mode。
3. 点击 `Load unpacked`。
4. 选择：

```text
D:\auto-system\chrome-extension\temu-compliance-template
```

## 操作流程

1. 打开 Temu 合规中心。
2. 点击第一条商品的“编辑”，等待抽屉打开并触发 `query_detail`。
3. 点击“设为模板”，输入模板名；也可以点“获取货号”用 SPU 查询货号作为模板名。
4. 保存成功后，可在“查看已保存模板”中查看、删除、演练更改。
5. 对另一个商品打开编辑抽屉，进入模板列表，点击“演练更改”。
6. 先查看 `prepare-change` 的差异摘要，再点击“演练更改”调用 Temu 校验接口。
7. 只有确认差异无误后，才点击“真实保存”触发 `edit_compliance`。

## 数据要求

可直接应用的模板必须包含：

- `ownership`
- `product`
- `sections`
- `interfaceSnapshot.queryDetailCaptured=true`
- `submissionDraft.template_edit_request_list`

如果旧模板缺少 `query_detail` 快照，只能查看，不能演练或应用；请重新打开商品编辑抽屉并保存一次模板。
