# Temu Auto System 接口文档

## 1. 合规中心：商品合规信息

页面：`https://agentseller.temu.com/govern/information-supplementation`

目标链路：

1. 打开商品“编辑”抽屉，页面调用 `query_detail` 获取当前商品合规详情。
2. 系统保存可复用模板时，记录页面字段、`query_detail` 请求/响应快照、店铺归属和提交草稿。
3. 对目标商品应用模板前，先基于目标商品的 `query_detail` 快照生成变更请求。
4. 演练阶段只调用 `query_dynamic_template` 和 `check_edit_compliance`。
5. 真实保存阶段必须人工确认后调用 `edit_compliance`。

### 1.1 查询当前合规详情

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/query_detail
```

用途：

- 获取目标商品 `goods_id`、`spu_id`、`cat_id`、SKU 列表。
- 获取当前 `wait_task_list`、`template_list`、负责人/制造商信息、已填属性、文本输入等。
- 这是生成模板和目标商品更改请求的来源数据。

关键请求体：

```json
{
  "goods_id": 601101429103977,
  "spu_id": 4095621222,
  "wait_task_list": [
    {
      "task_id": 101011969772072,
      "task_type": 4,
      "task_name": "加州 65 号提案",
      "status": 3,
      "task_status": 3
    }
  ]
}
```

关键响应字段：

- `result.goods_id`、`result.spu_id`、`result.cat_id`
- `result.group_sku_by_same_info`
- `result.sku_info_list`
- `result.template_list`
- `template_list[].task_type`
- `template_list[].template_id`
- `template_list[].properties`
- `template_list[].input_text`
- `template_list[].rep_detail_list`

### 1.2 查询动态模板展示状态

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/query_dynamic_template
```

用途：

- 在正式校验前确认动态模板是否已完整展示。
- 演练阶段可以真实调用该接口，因为它不保存商品。

关键请求体：

```json
{
  "spu_id": 4095621222,
  "goods_id": 601101429103977,
  "group_sku_by_same_info": true,
  "template_edit_request_list": [],
  "displayed_task_type_list": [4, 25, 33, 35, 42, 60, 61, 84, 166]
}
```

### 1.3 校验编辑内容

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/check_edit_compliance
```

用途：

- 对比旧合规任务和新合规任务。
- 返回可提交的新旧任务列表、差异、是否需要审核等结果。
- 演练阶段可以真实调用该接口，因为它不保存商品。

关键请求体：

```json
{
  "cat_id": 30718,
  "spu_id": 4095621222,
  "goods_id": 601101429103977,
  "group_sku_by_same_info": true,
  "simple_template_list": [],
  "new_template_edit_request_list": [],
  "old_template_edit_request_list": []
}
```

### 1.4 保存合规信息

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/edit_compliance
```

用途：

- 真实写入商品合规信息。
- 必须在系统展示差异摘要并经人工二次确认后调用。

安全要求：

- 不允许无人值守批量调用。
- 不允许跨商品复用 `goods_id`、`spu_id`、`task_id`、`cat_id`。
- 不记录完整 `Cookie`、`Authorization`、`Anti-Content`、`anti-token` 等敏感字段。

## 2. 本地合规模板 API

服务：`http://127.0.0.1:8787`

数据库默认：`postgres://postgres:postgres@127.0.0.1:5432/ecommerce_aggregation`

### 2.1 模板表

`ComplianceInfoTemplate`

关键字段：

- `id`
- `name`
- `companyId`
- `shopId`
- `platform`
- `siteKey`
- `spuId`
- `productTitle`
- `category`
- `sourceUrl`
- `templateInfoJson`

`templateInfoJson` 必须包含：

- `ownership`
- `product`
- `sections`
- `interfaceSnapshot`
- `submissionDraft`
- `usability`

### 2.2 依赖表

`Shop`

- 用 `shopName`、内部 `shopId` 或平台 `platformShopId` 解析模板归属。

`PluginCookieHeader`

- 用 `companyId`、`siteKey`、`sourceOrigin` 找最新 Temu 会话。
- 只读取 `cookieHeader`、`mallId`、`sourceOrigin`、`siteKey`、`companyId` 用于请求 Temu。
- 不把完整敏感 header 写入日志、文档或模板 JSON。

### 2.3 模板 CRUD

```http
GET /api/compliance-info-templates?companyId=&siteKey=&search=&page=&pageSize=
POST /api/compliance-info-templates
POST /api/compliance-info-templates/replace
DELETE /api/compliance-info-templates/:id
GET /api/compliance-info-templates/ownership?platform=TEMU&shopName=&shopId=
```

### 2.4 查询商品货号

```http
POST /api/temu/product-ext-code
```

请求：

```json
{
  "spuId": "3514785828",
  "companyId": "cmqw38bxl0000v4c4kk33ssqy",
  "siteKey": "agentseller.temu.com",
  "sourceOrigin": "https://agentseller.temu.com"
}
```

已验证烟测：

- 输入 SPU `3514785828`
- 返回货号 `JSB-68`

### 2.5 模板匹配

```http
GET /api/compliance-info-templates/match?companyId=&shopId=&siteKey=&spuId=&extCode=&category=
```

匹配规则：

- `name == extCode` 权重最高。
- `spuId` 相同次之。
- `category` 相同作为弱匹配。
- 只在同 `companyId`、同 `shopId`、同 `siteKey` 范围内返回候选。
- 返回 `matchScore`、`matchReasons`、`usability`。

### 2.6 生成更改预览

```http
POST /api/compliance-info-templates/prepare-change
```

请求：

```json
{
  "templateId": "template-id",
  "targetQueryDetailSnapshot": {
    "requestBody": {},
    "responseBody": {}
  }
}
```

返回：

- `diffSummary`
- `missing`
- `dynamicTemplateRequest`
- `checkEditRequest`
- `applyRequest`

如果模板缺 `interfaceSnapshot.queryDetailCaptured=true` 或 `submissionDraft.template_edit_request_list`，返回 `422`，需要重新保存模板。

### 2.7 演练更改

```http
POST /api/compliance-info-templates/dry-run-change
```

行为：

- 调用 Temu `query_dynamic_template`。
- 调用 Temu `check_edit_compliance`。
- 不调用 `edit_compliance`。
- 返回 Temu 校验结果和可用于真实保存的 `applyRequest`。

### 2.8 真实保存

```http
POST /api/compliance-info-templates/apply-change
```

请求必须包含：

```json
{
  "templateId": "template-id",
  "applyRequest": {},
  "confirmApply": true
}
```

行为：

- 只有 `confirmApply=true` 才调用 Temu `edit_compliance`。
- 返回非敏感请求摘要和 Temu 响应。

## 3. 验收路径

1. 启动本地 API。
2. 连接 9222 Chrome，打开合规中心。
3. 第一条商品 SPU `3514785828` 查询货号，预期 `JSB-68`。
4. 打开第一条商品编辑抽屉，保存模板，确认模板 JSON 有 `queryDetailCaptured=true`。
5. 对当前商品执行 `prepare-change`，确认返回差异摘要。
6. 执行 `dry-run-change`，确认只调用两个校验接口。
7. 只有人工确认后执行 `apply-change`。
