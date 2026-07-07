# Temu Auto System V1 需求文档

## 1. 背景

Temu Auto System 是面向运营人员的本地自动化辅助系统。V1 不追求绕过 Temu 风控或全无人值守，而是把已取证的后台接口沉淀为可审计、可演练、可人工确认的工作流，减少重复点击和人工组装请求的风险。

## 2. 目标用户

- 运营人员：处理 Temu 合规、调价、库存、核价、加站等日常待办。
- 店铺负责人：确认高风险操作是否符合预期。
- 开发维护人员：维护接口适配、请求构造、日志和安全边界。

## 3. V1 范围

### 3.1 纳入范围

1. 商品合规信息
   - 查询商品当前合规详情。
   - 保存合规信息模板。
   - 按店铺、站点、SPU、货号、类目匹配模板。
   - 基于目标商品 `query_detail` 快照生成更改预览。
   - 先执行校验演练，再由人工确认后真实保存。

2. 商品实拍图
   - 查询实拍图详情。
   - 获取上传参数。
   - 发起上传前预校验。

3. 上新调价
   - 查询商品调价信息、优惠券最小金额、调价原因和权限。
   - 支持按商品发起批量调价提交前预览。

4. 商品列表库存
   - 读取商品表格行数据。
   - 打开库存修改数据。
   - 保存库存修改前人工确认。

5. 申报核价
   - 查询待确认申报价。
   - 按接口返回 SKU 和价格生成提交请求。
   - 提交前展示价格差异和影响商品。

6. 产品加站
   - 快速筛选“商品信息待确认”列表。
   - 查询待确认商品详情。
   - 根据详情生成加站确认提交参数。

### 3.2 暂不纳入范围

- 绕过 Temu 风控、验证码或登录限制。
- 保存完整 `Cookie`、`Authorization`、`Anti-Content`、`anti-token` 等可复用认证信息到文档、配置或模板。
- 无人工确认的真实写操作批量提交。
- 未取证接口的真实写操作。
- 多人后台权限和审批流。

## 4. 合规模板工作流

### 4.1 保存模板

用户在合规中心打开商品“编辑合规信息”抽屉后，扩展插入“设为模板”按钮。

保存内容：

- 店铺归属：`companyId`、`shopId`、`platformShopId`、`shopName`、`siteKey`
- 商品信息：`spuId`、`productTitle`、`category`、`sourceUrl`
- 页面字段：按合规区块采集的 `sections`
- 接口快照：`query_detail` 的请求体和响应结果摘要
- 提交草稿：从 `query_detail` 派生的 `submissionDraft`

模板必须可追溯到原始 `query_detail`，否则只能查看，不能应用。

### 4.2 匹配模板

系统按同 `companyId`、同 `shopId`、同 `siteKey` 查询候选模板。

匹配优先级：

1. 模板名等于商品货号 `extCode`
2. 模板 SPU 等于目标商品 SPU
3. 类目相同
4. 最近更新时间

返回结果必须展示匹配原因和模板可用性。

### 4.3 生成更改预览

系统使用目标商品最新 `query_detail` 快照作为上下文，不允许直接复用源模板的 `goods_id`、`spu_id`、`task_id`。

生成结果：

- `dynamicTemplateRequest`
- `checkEditRequest`
- `applyRequest`
- `diffSummary`
- `missing`

如果缺少 `goods_id`、`spu_id`、`cat_id`、`template_edit_request_list` 或 `displayed_task_type_list`，必须阻止演练。

### 4.4 演练更改

默认执行演练模式：

- 调用 `query_dynamic_template`
- 调用 `check_edit_compliance`
- 不调用 `edit_compliance`

演练结果展示：

- 动态模板接口响应
- 校验接口响应
- 变更后的 `applyRequest`
- 非敏感请求摘要

### 4.5 真实保存

真实保存属于高风险写操作，必须满足：

- 已经生成预览。
- 已经完成演练。
- 用户通过二次确认。
- 请求体来自目标商品最新查询结果和模板映射结果。

本地 API 只有收到 `confirmApply=true` 才允许调用 `edit_compliance`。

## 5. 数据与安全规则

- `mallId` 必须来自 `PluginCookieHeader.mallId` 或当前 cookie 中的 `mallid`。
- `goods_id`、`spu_id`、`cat_id`、`task_id` 必须来自目标商品 `query_detail`。
- 模板只复用合规填写内容，不复用目标商品身份字段。
- 敏感 header 只在内存中用于请求 Temu，不写入模板、文档、错误日志或 UI。
- 请求失败时，只展示接口名、状态码、商品标识和非敏感错误信息。

## 6. 本地交付形态

V1 当前形态：

- Chrome 扩展负责页面捕获和人工操作入口。
- 本地 Node API 负责模板存储、匹配、请求构造和 Temu 接口调用。
- Postgres 负责保存店铺、cookie/header 摘要和合规模板。

## 7. 验收标准

1. 可以从合规中心第一条商品保存模板。
2. 保存后的模板 JSON 包含 `interfaceSnapshot.queryDetailCaptured=true`。
3. 可以用 SPU `3514785828` 查询货号，预期返回 `JSB-68`。
4. 可以按同店铺、同站点匹配模板，并看到匹配原因。
5. 可以生成更改预览，且预览中目标 `goods_id`、`spu_id` 来自目标商品。
6. 演练只调用 `query_dynamic_template` 和 `check_edit_compliance`。
7. 真实保存必须二次确认，并且本地 API 必须收到 `confirmApply=true`。
8. 文档、日志和模板中不出现完整敏感 header。

## 8. 风险

- Temu 接口字段和风控策略可能变化，导致请求失效。
- 模板跨类目或跨店铺误用会造成错误提交，必须通过匹配范围和差异预览降低风险。
- 旧模板如果没有 `query_detail` 快照，不能直接应用。
- 页面抽屉未触发或扩展未捕获 `query_detail` 时，不能生成有效更改预览。
