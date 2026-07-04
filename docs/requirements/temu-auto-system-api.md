# Temu Auto System 接口文档

## 1. 合规中心

### 1.1 商品合规信息

#### 1.1.1 编辑按钮(获取商品信息)

点击商品合规信息页面中的“编辑”按钮后，请求商品当前合规信息详情。该接口用于获取商品 SKU 信息、合规任务模板、已填写属性、负责人信息等。

**接口地址**

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/query_detail
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "goods_id": 601101429103977,
  "spu_id": 4095621222,
  "wait_task_list": [
    {
      "task_id": 101011969772072,
      "task_type": 4,
      "is_not_required": false,
      "task_name": "加州 65 号提案",
      "status": 3,
      "task_status": 3
    },
    {
      "task_id": 101011969768247,
      "task_type": 25,
      "is_not_required": true,
      "task_name": "欧盟负责人",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101011969752569,
      "task_type": 33,
      "is_not_required": true,
      "task_name": "制造商属性",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101011969752568,
      "task_type": 35,
      "is_not_required": true,
      "task_name": "质量保证标准",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101011969749668,
      "task_type": 42,
      "is_not_required": true,
      "task_name": "警告或安全信息（补充）",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101011969760282,
      "task_type": 60,
      "is_not_required": true,
      "task_name": "制造商信息",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101011969745920,
      "task_type": 61,
      "is_not_required": false,
      "task_name": "商品识别码",
      "status": 3,
      "punish_time": 0,
      "task_status": 3
    },
    {
      "task_id": 101068909886442,
      "task_type": 84,
      "is_not_required": true,
      "task_name": "土耳其负责人",
      "status": 2,
      "punish_time": 0,
      "task_status": 2
    },
    {
      "task_id": 101018067198665,
      "task_type": 166,
      "is_not_required": true,
      "task_name": "包装材料信息收集",
      "status": 2,
      "punish_time": 0,
      "task_status": 2
    }
  ]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "goods_id": 601101429103977,
    "spu_id": 4095621222,
    "sku_info_list": [
      {
        "sku_id": 17599809602403,
        "sku_name": "卡其色",
        "weight": 160.0
      },
      {
        "sku_id": 17599809602402,
        "sku_name": "绿色",
        "weight": 160.0
      },
      {
        "sku_id": 17599809602401,
        "sku_name": "桔红色",
        "weight": 160.0
      },
      {
        "sku_id": 17599809602400,
        "sku_name": "黑色",
        "weight": 160.0
      }
    ],
    "template_list": [
      {
        "template_id": 1,
        "task_type": 4,
        "task_status": 3,
        "properties": {
          "1000000002": [],
          "1000000001": [1000100066]
        },
        "suppl_prop_info_list": [],
        "input_text": {}
      },
      {
        "template_id": 27,
        "task_type": 33,
        "task_status": 3,
        "properties": {
          "1000100091": [1000131288]
        },
        "suppl_prop_info_list": [],
        "input_text": {}
      },
      {
        "template_id": 29,
        "task_type": 35,
        "task_status": 3,
        "properties": {
          "1000100087": [1000131288]
        },
        "suppl_prop_info_list": [],
        "input_text": {}
      },
      {
        "template_id": 36,
        "task_type": 42,
        "task_status": 3,
        "properties": {
          "1000100110": [1000131288]
        },
        "suppl_prop_info_list": [],
        "input_text": {}
      },
      {
        "template_id": 51,
        "task_type": 61,
        "task_status": 3,
        "properties": {
          "1100100115": [0]
        },
        "suppl_prop_info_list": [],
        "input_text": {
          "1100100115": {
            "multi_line_inputs": [
              {
                "name": "20240316-333"
              }
            ]
          }
        }
      },
      {
        "template_id": 1004,
        "task_type": 166,
        "task_status": 2
      },
      {
        "task_type": 60,
        "task_status": 3,
        "rep_detail_list": [
          {
            "rep_type": 3,
            "rep_id": 20445144,
            "rep_name": "Putian Licheng district Chen'en trading co., Ltd.",
            "rep_address_info": {
              "region_id": 43,
              "region_name": "China",
              "region_name_short": "CN",
              "city_id": 350300,
              "city": "Putian",
              "state_id": 350000,
              "state_name": "Fujian",
              "address_line_one": "Room 303,Staircase 2,Building 3,Shallow Water Bay Tao yuan,No.1699 Xiandian Road, Gongchen Street, Licheng district",
              "post_code": "351100"
            },
            "rep_mobile": "13515057993",
            "rep_tel_code": 86,
            "rep_mail": "xjx0813@sina.com",
            "rep_status": 3,
            "skip_edit": false,
            "forbid_select": false,
            "default_select": true
          }
        ],
        "reject_reason_list": []
      },
      {
        "task_type": 25,
        "task_status": 3,
        "rep_detail_list": [
          {
            "rep_type": 0,
            "rep_id": 51245239,
            "rep_name": "SUCCESS COURIER SL",
            "rep_address_info": {
              "region_id": 186,
              "region_name": "Spain",
              "region_name_short": "ES",
              "city": "FUENLABRADA",
              "state_name": "MADRID",
              "address_line_one": "CALLE RIO TORMES NUM. 1, PLANTA 1, DERECHA, OFICINA 3, Fuenlabrada, Madrid, 28947 Spain",
              "full_name": "Peter",
              "post_code": "28947"
            },
            "rep_mobile": "910602659",
            "rep_tel_code": 34,
            "rep_mail": "successservice2@hotmail.com",
            "rep_status": 3,
            "start_timestamp": 1758470400000,
            "end_timestamp": 1790006399999,
            "skip_edit": false,
            "forbid_select": false,
            "default_select": true
          }
        ],
        "reject_reason_list": []
      }
    ],
    "group_sku_by_same_info": true
  }
}
```

**字段说明**


| 字段                     | 含义                       | 说明                                                 |
| ------------------------ | -------------------------- | ---------------------------------------------------- |
| `success`                | 请求是否成功               | 成功为`true`                                         |
| `error_code`             | 业务状态码                 | 本次返回`1000000`                                    |
| `result.goods_id`        | 商品 goodsId               | 与请求体一致                                         |
| `result.spu_id`          | 商品 SPU ID                | 与请求体一致                                         |
| `result.sku_info_list`   | 商品 SKU 列表              | 包含`sku_id`、`sku_name`、`weight`                   |
| `result.template_list`   | 商品合规任务详情列表       | 不同`task_type` 对应不同合规任务                     |
| `template_id`            | 模板 ID                    | 部分负责人类任务不返回`template_id`                  |
| `task_type`              | 合规任务类型               | 如`4`=加州65号提案，`25`=欧盟负责人，`60`=制造商信息 |
| `task_status`            | 任务状态                   | 本次观察`3`=已填写/完成，`2`=待填写                  |
| `properties`             | 枚举类属性选择值           | 键为属性 ID，值为选项 ID 数组                        |
| `input_text`             | 文本类输入值               | 商品识别码等文本字段会出现在这里                     |
| `rep_detail_list`        | 负责人/制造商信息列表      | 欧盟负责人、制造商信息等任务使用                     |
| `default_select`         | 是否默认选中               | `true` 表示当前默认使用该负责人/制造商               |
| `group_sku_by_same_info` | SKU 是否共用同一组合规信息 | 本次返回`true`                                       |

**任务类型观察**


| task_type | 任务名称               | 返回重点                                                                        | 本次状态 |
| --------: | ---------------------- | ------------------------------------------------------------------------------- | -------- |
|       `4` | 加州 65 号提案         | `properties.1000000001=[1000100066]`                                            | `3`      |
|      `25` | 欧盟负责人             | `rep_detail_list`，默认选中 `SUCCESS COURIER SL`                                | `3`      |
|      `33` | 制造商属性             | `properties.1000100091=[1000131288]`                                            | `3`      |
|      `35` | 质量保证标准           | `properties.1000100087=[1000131288]`                                            | `3`      |
|      `42` | 警告或安全信息（补充） | `properties.1000100110=[1000131288]`                                            | `3`      |
|      `60` | 制造商信息             | `rep_detail_list`，默认选中 `Putian Licheng district Chen'en trading co., Ltd.` | `3`      |
|      `61` | 商品识别码             | `input_text.1100100115.multi_line_inputs[0].name=20240316-333`                  | `3`      |
|     `166` | 包装材料信息收集       | 返回`template_id=1004`，暂无详细填写内容                                        | `2`      |

**注意事项**

- `Cookie`、`Authorization`、`anti-content` 等敏感请求头不写入代码和文档。
- 该接口为查询接口，不会直接修改商品合规信息。
- 后续保存编辑内容时，应另行记录校验接口和提交接口，并在取证时进行拦截。

#### 1.1.2 确认按钮(查询动态模板展示状态)

点击编辑窗口中的“确认”按钮后，页面会先请求动态模板展示状态。该接口用于根据当前编辑后的合规任务列表，判断需要展示的模板是否已经完整展示。

**接口地址**

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/query_dynamic_template
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "spu_id": 4095621222,
  "goods_id": 601101429103977,
  "group_sku_by_same_info": true,
  "template_edit_request_list": [
    {
      "task_id": 101011969772072,
      "task_status": 3,
      "task_type": 4,
      "template_id": 1,
      "properties": {
        "1000000001": [1000100066]
      },
      "images": {},
      "input_text": {}
    },
    {
      "task_id": 101011969745920,
      "task_status": 3,
      "task_type": 61,
      "template_id": 51,
      "properties": {},
      "images": {},
      "input_text": {
        "1100100115": {
          "multi_line_inputs": [
            {
              "name": "20240316-333"
            }
          ]
        }
      }
    },
    {
      "task_id": 101011969768247,
      "task_type": 25,
      "is_not_required": true,
      "task_name": "欧盟负责人",
      "status": 3,
      "task_status": 3,
      "rep_detail_list": [
        {
          "rep_id": 51245239,
          "rep_name": "SUCCESS COURIER SL"
        }
      ]
    }
  ],
  "displayed_task_type_list": [4, 25, 33, 35, 42, 60, 61, 84, 166]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "all_template_displayed": true
  }
}
```

**字段说明**


| 字段                            | 含义                         | 说明                                   |
| ------------------------------- | ---------------------------- | -------------------------------------- |
| `template_edit_request_list`    | 当前编辑窗口中的合规任务列表 | 提交校验和最终保存时也会复用该结构     |
| `displayed_task_type_list`      | 当前页面已展示的任务类型     | 用于判断动态模板是否已经全部展示       |
| `result.all_template_displayed` | 模板是否完整展示             | `true` 表示可继续进入后续校验/提交流程 |

#### 1.1.3 确认按钮(校验编辑内容)

动态模板检查通过后，页面会调用编辑内容校验接口。该接口用于对比新旧合规信息，并返回最终可提交的新旧任务列表、差异信息以及是否需要审核等结果。

**接口地址**

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/check_edit_compliance
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "cat_id": 30718,
  "spu_id": 4095621222,
  "goods_id": 601101429103977,
  "group_sku_by_same_info": true,
  "simple_template_list": [
    {
      "template_id": 1,
      "template_name": "加利福尼亚州65号法案",
      "task_type": 4,
      "template_dimension_type": 1,
      "support_multi_group": false
    },
    {
      "template_id": 51,
      "template_name": "商品识别码",
      "task_type": 61,
      "template_dimension_type": 1,
      "support_multi_group": false
    }
  ],
  "new_template_edit_request_list": [
    {
      "task_id": 101011969772072,
      "task_status": 3,
      "task_type": 4,
      "template_id": 1,
      "properties": {
        "1000000001": [1000100066]
      },
      "images": {},
      "input_text": {}
    },
    {
      "task_id": 101011969760282,
      "task_type": 60,
      "is_not_required": true,
      "task_name": "制造商信息",
      "status": 3,
      "task_status": 3,
      "rep_detail_list": [
        {
          "rep_id": 20445144,
          "rep_name": "Putian Licheng district Chen'en trading co., Ltd."
        }
      ]
    }
  ],
  "old_template_edit_request_list": [
    {
      "template_id": 1,
      "task_type": 4,
      "task_status": 3,
      "properties": {
        "1000000001": [1000100066],
        "1000000002": []
      },
      "input_text": {},
      "task_id": 101011969772072
    }
  ]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "goods_id": 601101429103977,
    "spu_id": 4095621222,
    "cat_id": 30718,
    "old_template_edit_request_list": [
      {
        "template_id": 1,
        "task_type": 4,
        "task_status": 3,
        "task_id": 101011969772072,
        "properties": {
          "1000000001": [1000100066],
          "1000000002": []
        },
        "input_text": {},
        "need_audit": false
      }
    ],
    "new_template_edit_request_list": [
      {
        "template_id": 1,
        "task_type": 4,
        "task_status": 3,
        "task_id": 101011969772072,
        "properties": {
          "1000000001": [1000100066]
        },
        "input_text": {},
        "images": {},
        "need_audit": false
      }
    ],
    "diff_template_list": []
  }
}
```

**字段说明**


| 字段                             | 含义                 | 说明                                                      |
| -------------------------------- | -------------------- | --------------------------------------------------------- |
| `simple_template_list`           | 简化后的模板定义列表 | 包含模板 ID、模板名称、任务类型、控件配置等；实际返回较长 |
| `new_template_edit_request_list` | 本次编辑后的任务列表 | 与最终提交接口中的`template_edit_request_list` 基本一致   |
| `old_template_edit_request_list` | 编辑前的任务列表     | 用于后端校验新旧内容差异                                  |
| `need_audit`                     | 是否需要审核         | 本次观察为`false`                                         |
| `diff_template_list`             | 变更差异列表         | 本次观察为空数组                                          |

#### 1.1.4 确认按钮(提交编辑内容)

校验接口通过后，页面调用该接口正式保存商品合规信息。该接口为编辑窗口“确认”动作中的实际提交接口，成功后页面会刷新商品合规信息列表。

**接口地址**

```http
POST https://agentseller.temu.com/ms/bg-flux-ms/compliance_property/edit_compliance
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "cat_id": 30718,
  "spu_id": 4095621222,
  "goods_id": 601101429103977,
  "group_sku_by_same_info": true,
  "template_edit_request_list": [
    {
      "task_id": 101011969772072,
      "task_status": 3,
      "task_type": 4,
      "template_id": 1,
      "properties": {
        "1000000001": [1000100066]
      },
      "images": {},
      "input_text": {}
    },
    {
      "task_id": 101011969745920,
      "task_status": 3,
      "task_type": 61,
      "template_id": 51,
      "properties": {},
      "images": {},
      "input_text": {
        "1100100115": {
          "multi_line_inputs": [
            {
              "name": "20240316-333"
            }
          ]
        }
      }
    },
    {
      "task_id": 101011969768247,
      "task_type": 25,
      "is_not_required": true,
      "task_name": "欧盟负责人",
      "status": 3,
      "task_status": 3,
      "rep_detail_list": [
        {
          "rep_id": 51245239,
          "rep_name": "SUCCESS COURIER SL"
        }
      ]
    },
    {
      "task_id": 101011969760282,
      "task_type": 60,
      "is_not_required": true,
      "task_name": "制造商信息",
      "status": 3,
      "task_status": 3,
      "rep_detail_list": [
        {
          "rep_id": 20445144,
          "rep_name": "Putian Licheng district Chen'en trading co., Ltd."
        }
      ]
    }
  ]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "result": true
  }
}
```

**字段说明**


| 字段                         | 含义                   | 说明                                              |
| ---------------------------- | ---------------------- | ------------------------------------------------- |
| `cat_id`                     | 类目 ID                | 本次商品类目为`30718`                             |
| `template_edit_request_list` | 最终提交的合规任务列表 | 包含属性选择、文本输入、图片、负责人/制造商等信息 |
| `properties`                 | 枚举类属性选择值       | 键为属性 ID，值为选项 ID 数组                     |
| `input_text`                 | 文本类输入值           | 商品识别码等字段使用该结构                        |
| `rep_detail_list`            | 负责人/制造商选择结果  | 仅提交`rep_id`、`rep_name` 等必要信息             |
| `result.result`              | 保存结果               | `true` 表示保存成功                               |

**确认按钮接口顺序**


| 顺序 | 接口                     | 作用                           |
| ---: | ------------------------ | ------------------------------ |
|    1 | `query_dynamic_template` | 检查动态模板是否完整展示       |
|    2 | `check_edit_compliance`  | 校验编辑内容并对比新旧合规任务 |
|    3 | `edit_compliance`        | 正式保存商品合规信息           |

**注意事项**

- `edit_compliance` 为写接口，会实际修改商品合规信息；调试时不要重复提交无关商品。
- 三个接口均依赖当前浏览器登录态，请求头中的敏感字段不应落库或写入代码。
- `template_edit_request_list` 中不同 `task_type` 的结构不完全一致，枚举/文本/负责人类任务需要分别处理。

### 1.2 商品实拍图

#### 1.2.1 修改按钮(获取实拍图详情)

点击商品实拍图页面中商品行的“修改”按钮后，页面会请求该商品的实拍图详情。该接口用于获取商品基础信息、已上传实拍图、标签识别结果、SKU 信息、各拍摄位置图片等。

**接口地址**

```http
POST https://agentseller.temu.com/api/flash/real_picture/detail
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "spu_id": 6903993073,
  "goods_id": 601101873074966
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "spu_id": 6903993073,
    "spu_name": "JIT【已授权】【Holiday Gifts】1Pc Disney Jack Skellington 2D cartoon print,elegant couple style simple monochrome cartoon beret,classic PU leather retro art painter hat short edge French round hat detective",
    "material_img_url": "https://img.kwcdn.com/product/open/fd4e8c74a6194d46b27aa7f713b6eb48-goods.jpeg",
    "is_same_sku": true,
    "label_image_list": [
      {
        "image": "https://pos.file.temu.com/flash-tag/20237f72c6/9868d08b-8803-45a7-9356-333acc721ee8_3072x4098.jpeg",
        "position": 1
      },
      {
        "image": "https://pos.file.temu.com/flash-tag/20237f72c6/040c8385-7e10-4bb2-9da5-efaf9616d35c_822x812.png",
        "position": 2
      }
    ],
    "upload_status": 1,
    "rule_check_result_list": [
      {
        "check_type": 5270,
        "rule_name": "西班牙税号",
        "rule_status": 3,
        "rule_status_toast": "系统识别能力待建设",
        "affected_site_count": 1,
        "rule_result": [
          {
            "type": 1,
            "toast": "系统识别能力待建设，建设完成后会自动识别并更新结果",
            "need_language": false
          }
        ],
        "material_list": [
          {
            "content_type": 0,
            "text": "VAT No./Número de IVA: IE4096471TH"
          }
        ],
        "error_code": []
      },
      {
        "check_type": 5138,
        "rule_name": "欧盟英国纺织品本体标签（家纺&配饰-单品）",
        "rule_status": 4,
        "rule_status_toast": "识别有异常",
        "affected_site_count": 28,
        "effect_result": "暂不影响商品售卖，请确保实拍图和实物标签均符合使用法律法规",
        "rule_result": [
          {
            "type": 1,
            "toast": "商品实拍图中无洗水唛",
            "color": "#F71010",
            "need_language": false
          }
        ],
        "error_code": [1]
      }
    ],
    "button_status": 1,
    "goods_id": 601101873074966,
    "can_audit": true,
    "can_edit": true,
    "position_detail": [
      {
        "position": 1,
        "is_same_sku": true,
        "sku_info": [
          {
            "sku_id": 21582010624,
            "sku_name": "21582010624(米白色)",
            "sku_image": "https://img.kwcdn.com/product/open/4a40e2aedf294339891ac6ff2d3601d1-goods.jpeg"
          }
        ],
        "sku_photo_info_list": [
          {
            "sku_id": 0,
            "image_list": [
              {
                "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/9868d08b-8803-45a7-9356-333acc721ee8_3072x4098.jpeg",
                "position_type": 2
              }
            ]
          }
        ],
        "black_word_result_map": {
          "-1": []
        },
        "photo_requirement_list": []
      }
    ],
    "sku_info": [
      {
        "sku_id": 21582010624,
        "sku_name": "21582010624(米白色)",
        "sku_image": "https://img.kwcdn.com/product/open/4a40e2aedf294339891ac6ff2d3601d1-goods.jpeg"
      }
    ],
    "guide_file_info": {
      "uploaded": false,
      "hit_guide_file": false
    },
    "show_eu_doc_cert_tip": false
  }
}
```

**字段说明**


| 字段                     | 含义                     | 说明                                                         |
| ------------------------ | ------------------------ | ------------------------------------------------------------ |
| `result.spu_id`          | 商品 SPU ID              | 与请求体一致                                                 |
| `result.goods_id`        | 商品 goodsId             | 与请求体一致                                                 |
| `result.spu_name`        | 商品名称                 | 修改弹窗中展示的商品标题                                     |
| `material_img_url`       | 商品主图                 | 商品素材图 URL                                               |
| `is_same_sku`            | SKU 是否共用同一组实拍图 | 本次观察为`true`                                             |
| `label_image_list`       | 已上传标签/实拍图列表    | 包含图片 URL 和位置`position`                                |
| `upload_status`          | 上传状态                 | 本次观察为`1`                                                |
| `rule_check_result_list` | 标签/实拍图识别规则结果  | 包含`check_type`、`rule_name`、`rule_status`、异常原因等     |
| `rule_status`            | 识别状态                 | 本次观察`2`=识别成功，`3`=系统识别能力待建设，`4`=识别有异常 |
| `position_detail`        | 各拍摄位置的图片详情     | 包含 SKU、图片、敏感词识别、图片要求等                       |
| `sku_photo_info_list`    | SKU 维度图片列表         | `sku_id=0` 常用于共用图片                                    |
| `can_audit`              | 是否可提交审核           | 本次返回`true`                                               |
| `can_edit`               | 是否可编辑               | 本次返回`true`                                               |

#### 1.2.2 修改按钮(获取上传参数)

打开修改弹窗后，页面会继续请求上传参数。该接口用于获取当前商品需要上传的图片位置、每个位置支持的图片类型、数量限制、豁免信息以及是否展示规格/语言相关弹窗。

**接口地址**

```http
POST https://agentseller.temu.com/api/flash/real_picture/query_upload_param
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "goods_id": 601101873074966,
  "spu_id": 6903993073,
  "error_check_type_list": [5138, 1125, 1124, 1126, 883, 881, 1123]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "specification_language_list": [],
    "show_specification_pop_up": false,
    "exemption_info": {
      "apply_info_list": [],
      "result_list": [],
      "can_apply_num_map": {}
    },
    "position_info_list": [
      {
        "position": 1,
        "desc": "商品主体实拍图",
        "position_type_info": [
          {
            "type": 0,
            "desc": "正视图",
            "limit_nums": 1,
            "tips": "请上传商品主体正面外观"
          },
          {
            "type": 1,
            "desc": "侧视图",
            "limit_nums": 2,
            "tips": "请上传商品主体侧面外观(左侧+右侧)"
          },
          {
            "type": 2,
            "desc": "标签图",
            "limit_nums": 20,
            "tips": "请上传商品主体上的标签图"
          },
          {
            "type": 3,
            "desc": "其他",
            "limit_nums": 10,
            "tips": "请上传商品其他细节图，包括关键结构、材质、功能等细节部位，或其与商品主体相关的图片"
          }
        ]
      },
      {
        "position": 2,
        "desc": "商品外包装实拍图",
        "position_type_info": [
          {
            "type": 0,
            "desc": "正视图",
            "limit_nums": 1,
            "tips": "请上传商品外包装正面外观"
          },
          {
            "type": 1,
            "desc": "侧视图",
            "limit_nums": 2,
            "tips": "请上传商品外包装侧面外观(左侧+右侧)"
          },
          {
            "type": 2,
            "desc": "标签图",
            "limit_nums": 12,
            "tips": "请上传商品外包装上的标签图"
          },
          {
            "type": 3,
            "desc": "其他",
            "limit_nums": 10,
            "tips": "请上传商品其他细节图，包括关键结构、材质、功能等细节部位，或其与商品外包装相关的图片"
          }
        ]
      }
    ],
    "eu_doc_upload_tip": "完整版"
  }
}
```

**字段说明**


| 字段                          | 含义                 | 说明                                                 |
| ----------------------------- | -------------------- | ---------------------------------------------------- |
| `error_check_type_list`       | 异常识别规则类型列表 | 来源于详情接口中识别异常的`check_type`               |
| `specification_language_list` | 规格/语言配置列表    | 本次观察为空数组                                     |
| `show_specification_pop_up`   | 是否展示规格弹窗     | 本次观察为`false`                                    |
| `exemption_info`              | 豁免申请信息         | 包含可申请数量、申请结果等                           |
| `position_info_list`          | 上传位置配置         | 定义商品主体、外包装等位置                           |
| `position`                    | 拍摄位置             | 本次观察`1`=商品主体实拍图，`2`=商品外包装实拍图     |
| `position_type_info`          | 位置下的图片类型配置 | 包含正视图、侧视图、标签图、其他                     |
| `type`                        | 图片类型             | 本次观察`0`=正视图，`1`=侧视图，`2`=标签图，`3`=其他 |
| `limit_nums`                  | 上传数量限制         | 不同位置和图片类型限制不同                           |
| `eu_doc_upload_tip`           | 欧盟文件上传提示     | 本次返回`完整版`                                     |

**修改按钮接口顺序**


| 顺序 | 接口                              | 作用                                     |
| ---: | --------------------------------- | ---------------------------------------- |
|    1 | `real_picture/detail`             | 获取商品实拍图详情、识别结果和已上传图片 |
|    2 | `real_picture/query_upload_param` | 获取修改弹窗内的上传位置、类型和数量限制 |

**注意事项**

- 两个接口均为查询类接口，点击“修改”本身不会直接保存实拍图。
- `query_upload_param` 的 `error_check_type_list` 与详情接口中的异常规则强相关，通常取 `rule_status=4` 的 `check_type`。
- 图片上传和最终保存动作会触发其他接口，需要在弹窗内选择/上传图片并点击保存时另行抓包。

#### 1.2.3 上传并识别(实拍图预校验)

在商品实拍图修改弹窗中点击“上传并识别”后，页面会提交当前弹窗中的实拍图信息进行预校验/识别。该接口会根据商品主体、外包装等位置下的图片，返回识别是否通过、异常规则列表、是否可申请深度识别/审核等信息。

**接口地址**

```http
POST https://agentseller.temu.com/api/flash/real_picture/pre_verification
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |

**请求载荷**

```json
{
  "spu_id": 6903993073,
  "goods_id": 601101873074966,
  "real_picture_info_list": [
    {
      "position": 1,
      "is_same_sku": 1,
      "sku_photo_info_list": [
        {
          "sku_id": 21582010624,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/9868d08b-8803-45a7-9356-333acc721ee8_3072x4098.jpeg",
              "position_type": 2
            }
          ]
        },
        {
          "sku_id": 60788983974,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/9868d08b-8803-45a7-9356-333acc721ee8_3072x4098.jpeg",
              "position_type": 2
            }
          ]
        },
        {
          "sku_id": 71415968988,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/9868d08b-8803-45a7-9356-333acc721ee8_3072x4098.jpeg",
              "position_type": 2
            }
          ]
        }
      ]
    },
    {
      "position": 2,
      "is_same_sku": 1,
      "sku_photo_info_list": [
        {
          "sku_id": 21582010624,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/040c8385-7e10-4bb2-9da5-efaf9616d35c_822x812.png",
              "position_type": 2
            }
          ]
        },
        {
          "sku_id": 60788983974,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/040c8385-7e10-4bb2-9da5-efaf9616d35c_822x812.png",
              "position_type": 2
            }
          ]
        },
        {
          "sku_id": 71415968988,
          "image_list": [
            {
              "image_url": "https://pos.file.temu.com/flash-tag/20237f72c6/040c8385-7e10-4bb2-9da5-efaf9616d35c_822x812.png",
              "position_type": 2
            }
          ]
        }
      ]
    }
  ]
}
```

**返回示例**

```json
{
  "success": true,
  "error_code": 1000000,
  "result": {
    "check_result": false,
    "rule_check_result": [
      {
        "check_type": 1125,
        "rule_name": "GPSR欧盟进口商信息（本体）",
        "rule_status": 4,
        "rule_status_toast": "识别有异常",
        "affected_site_count": 0,
        "rule_result": [
          {
            "type": 1,
            "toast": "图中不存在商品本体",
            "color": "#F71010",
            "need_language": false
          }
        ],
        "show_specification": false,
        "material_list": [
          {
            "content_type": 0,
            "text": "For EU\nEU Importer Name: Whaleco Technology Limited\nEU Importer Address: First Floor, 25 St Stephens Green, Dublin 2, Ireland\nEU Importer Electronic Address: https://www.temu.com/contact-us.html"
          }
        ],
        "error_code": [1]
      },
      {
        "check_type": 883,
        "rule_name": "土耳其标签合规-土耳其负责人",
        "rule_status": 4,
        "rule_status_toast": "识别有异常",
        "affected_site_count": 0,
        "rule_result": [
          {
            "type": 1,
            "toast": "商品未绑定土代，请前往",
            "color": "#F71010",
            "need_language": false
          },
          {
            "type": 2,
            "toast": "商品合规信息",
            "jump_url": "https://agentseller.temu.com/govern/information-supplementation?spuId=6903993073",
            "url_link_types": ["spuId"],
            "need_language": false
          },
          {
            "type": 1,
            "toast": "进行修改",
            "color": "#F71010",
            "need_language": false
          }
        ],
        "error_code": [1]
      }
    ],
    "can_audit": true,
    "fake_eu_info_text_list": [],
    "black_word_result": {}
  }
}
```

**字段说明**


| 字段                     | 含义                    | 说明                                             |
| ------------------------ | ----------------------- | ------------------------------------------------ |
| `real_picture_info_list` | 待识别的实拍图列表      | 按拍摄位置组织图片                               |
| `position`               | 拍摄位置                | 本次观察`1`=商品主体实拍图，`2`=商品外包装实拍图 |
| `is_same_sku`            | 是否所有 SKU 共用图片   | `1` 表示同一位置下各 SKU 使用相同图片            |
| `sku_photo_info_list`    | SKU 维度图片列表        | 共用图片时每个 SKU 会带相同`image_list`          |
| `image_url`              | 图片 URL                | 已上传至平台文件服务的实拍图地址                 |
| `position_type`          | 图片类型                | 本次观察`2`=标签图                               |
| `result.check_result`    | 识别是否整体通过        | 本次返回`false`，表示存在异常                    |
| `rule_check_result`      | 识别规则结果列表        | 包含异常规则、提示文案、素材要求等               |
| `check_type`             | 规则类型 ID             | 如`1125`=GPSR欧盟进口商信息（本体）              |
| `rule_status`            | 规则识别状态            | 本次异常项返回`4`                                |
| `rule_result`            | 识别结果提示            | 可包含普通文案、跳转链接等多段提示               |
| `can_audit`              | 是否可申请审核/深度识别 | 本次返回`true`                                   |
| `black_word_result`      | 敏感词识别结果          | 本次返回空对象                                   |

**注意事项**

- 该接口会触发识别/预校验，但本次未观察到直接保存图片的接口。
- 请求中的图片必须已经上传完成，接口只提交图片 URL、SKU、位置和图片类型。
- 若 `check_result=false`，页面会展示异常规则，并可能提供“深度识别”等后续操作入口。

## 2. 上新调价

页面地址：

```text
https://agentseller.temu.com/newon/product-select
```

本部分记录“上新生命周期管理”页面中，点击第一个商品行右侧“发起调价”按钮，并在调价弹窗中填写 3 个 `30.37` 后点击左下角“确认调价”的接口。最终确认调价接口已在请求发出前拦截并中止，未实际提交调价。

### 2.1 第一个商品发起调价按钮

在商品表格第一行右侧“操作”列点击：

```text
发起调价
```

点击后打开调价弹窗，并触发调价信息、优惠券门槛、调价原因等前置查询接口。

#### 2.1.1 商品调价信息查询

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/mms/magneto/price-adjust/product-adjust-query
```

**说明**

用于获取当前商品可调价的 SKC/SKU、原申报价格、可填写价格等调价弹窗初始化数据。本次抓包中该请求体未由 CDP 返回，浏览器实际请求使用当前登录态、MallId、页面运行时签名等上下文。

#### 2.1.2 优惠券最小金额查询

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/gamblers/marketing/coupon/min/amount
```

**说明**

用于调价流程中营销/券相关金额约束查询。本次抓包中该请求体未由 CDP 返回。

#### 2.1.3 调价原因列表查询

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/mms/gmp/bg/magneto/api/price/adjust/reason/list
```

**说明**

用于获取调价弹窗中的“调价原因”下拉选项。本次页面默认选中：

```text
降价提升竞争力
```

后续确认调价请求中对应字段为：

```json
{
  "adjustReason": 3
}
```

#### 2.1.4 灰度/权限匹配查询

**接口地址**

```http
POST https://agentseller.temu.com/lollipop/gray/agent/seller/batchMatchBySupplierIdsWithMulGray
```

**说明**

用于页面功能灰度、权限或供应商维度能力匹配。本次抓包中该请求体未由 CDP 返回。

**请求头说明**


| 参数                          | 值                 | 说明                                          |
| ----------------------------- | ------------------ | --------------------------------------------- |
| `Content-Type`                | `application/json` | 请求体为 JSON                                 |
| `Cookie`                      | `[登录态 Cookie]`  | 使用当前浏览器登录态，文档中不保存完整 Cookie |
| `Mallid`                      | `634418220627643`  | 当前店铺/主体 ID，本次抓包上下文              |
| `anti-content` / `anti-token` | `[REDACTED]`       | 页面运行时生成，文档中不保存具体值            |

### 2.2 确认调价提交接口

调价弹窗中本次填写 3 个 SKU 的“调整后申报价格(CNY)”：

```text
30.37
30.37
30.37
```

点击左下角按钮：

```text
确认调价
```

#### 2.2.1 商品批量调价提交

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/mms/gmp/bg/magneto/api/price/priceAdjust/gmpProductBatchAdjustPrice
```

**请求头说明**


| 参数                          | 值                 | 说明                                          |
| ----------------------------- | ------------------ | --------------------------------------------- |
| `Content-Type`                | `application/json` | 请求体为 JSON                                 |
| `Cookie`                      | `[登录态 Cookie]`  | 使用当前浏览器登录态，文档中不保存完整 Cookie |
| `Mallid`                      | `634418220627643`  | 当前店铺/主体 ID，本次抓包上下文              |
| `anti-content` / `anti-token` | `[REDACTED]`       | 页面运行时生成，文档中不保存具体值            |

**请求载荷**

```json
{
  "adjustReason": 3,
  "adjustItems": [
    {
      "productName": "JIT【已授权】【Holiday Gifts】1Pc Disney Jack Skellington 2D cartoon print,elegant couple style simple monochrome cartoon beret,classic PU leather retro art painter hat short edge French round hat detective",
      "productSkcId": 90542150631,
      "skuAdjustList": [
        {
          "targetPriceCurrency": "CNY",
          "oldPriceCurrency": "CNY",
          "oldSupplyPrice": 3038,
          "skuId": 60788983974,
          "targetSupplyPrice": 3037,
          "syncPurchasePrice": 1
        },
        {
          "targetPriceCurrency": "CNY",
          "oldPriceCurrency": "CNY",
          "oldSupplyPrice": 3038,
          "skuId": 21582010624,
          "targetSupplyPrice": 3037,
          "syncPurchasePrice": 1
        },
        {
          "targetPriceCurrency": "CNY",
          "oldPriceCurrency": "CNY",
          "oldSupplyPrice": 3038,
          "skuId": 71415968988,
          "targetSupplyPrice": 3037,
          "syncPurchasePrice": 1
        }
      ],
      "productId": 6903993073,
      "supplierId": 634418220627643
    }
  ],
  "operateSource": 30
}
```

**字段说明**


| 字段                  | 含义               | 说明                                  |
| --------------------- | ------------------ | ------------------------------------- |
| `adjustReason`        | 调价原因           | 本次为`3`，页面显示“降价提升竞争力” |
| `operateSource`       | 操作来源           | 本次抓包为`30`                        |
| `adjustItems`         | 调价商品列表       | 数组，每个元素对应一个商品/SKC        |
| `productId`           | 商品 ID            | 本次第一个商品为`6903993073`          |
| `productSkcId`        | 商品 SKC ID        | 本次第一个商品为`90542150631`         |
| `supplierId`          | 供应商/店铺主体 ID | 本次为`634418220627643`               |
| `skuAdjustList`       | SKU 调价列表       | 每个 SKU 一条调价记录                 |
| `oldSupplyPrice`      | 原申报价格         | 单位为分，`3038` 表示 `30.38 CNY`     |
| `targetSupplyPrice`   | 调整后申报价格     | 单位为分，`3037` 表示 `30.37 CNY`     |
| `targetPriceCurrency` | 目标价格币种       | 本次为`CNY`                           |
| `oldPriceCurrency`    | 原价格币种         | 本次为`CNY`                           |
| `syncPurchasePrice`   | 是否同步采购价     | 本次为`1`                             |

**拦截结果**

```text
POST https://agentseller.temu.com/api/kiana/mms/gmp/bg/magneto/api/price/priceAdjust/gmpProductBatchAdjustPrice
Result: aborted / Failed to fetch
Observed report code: 444
```

本次取证在点击“确认调价”后拦截并中止 `gmpProductBatchAdjustPrice` 请求，因此未实际完成调价提交。页面随后产生 `Failed to fetch` 和 `code=444` 的前端监控上报，这是请求被中止后的监控结果，不是调价接口成功响应。

**注意事项**

- `gmpProductBatchAdjustPrice` 是真实状态变更接口，必须在点击“确认调价”前挂好拦截。
- 价格字段以分为单位传输，页面填写 `30.37` 对应请求中的 `targetSupplyPrice: 3037`。
- Cookie、Authorization、anti-content、anti-token、插件 token 等敏感信息均不写入文档。
- 自动化复现应在已登录浏览器页面上下文中执行，避免脱离 Temu 页面运行时签名、MallId 和账号权限上下文。

## 3. 商品列表

### 3.1 商品表格内修改库存

页面地址：

```text
https://agentseller.temu.com/goods/list
```

在商品表格任意商品行的右侧“操作”列中点击“修改库存”，页面会打开“修改库存”弹窗。弹窗内可对单个 SKU 填写“库存增减”值，点击“保存”后触发库存变更接口。

本次取证在“保存”动作前挂载拦截，最终库存保存请求已被中止，未实际修改商品库存。

#### 3.1.1 商品表格行数据

商品表格数据来自商品列表查询接口，行内会展示后续修改库存所需的商品、SKC、SKU 等基础信息。

**接口地址**

```http
POST https://agentseller.temu.com/visage-agent-seller/product/skc/pageQuery
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |
|                |                    |                                               |

**请求载荷**

本次点击“修改库存”时伴随观察到一次商品列表请求，浏览器抓包中该次请求体为空；商品表格初始加载和筛选查询时会使用当前页面筛选条件分页获取商品行数据。

```json
{}
```

**字段说明**


| 字段                              | 含义              | 说明                     |
| --------------------------------- | ----------------- | ------------------------ |
| `productId`                       | 商品 ID           | 后续库存保存接口需要     |
| `productSkcId`                    | 商品 SKC ID       | 后续库存保存接口需要     |
| `productSkuId`                    | 商品 SKU ID       | 后续库存保存接口需要     |
| `stockAvailable` / `virtualStock` | 当前可售/虚拟库存 | 弹窗中展示为“当前库存” |

#### 3.1.2 打开修改库存弹窗

点击表格行内“修改库存”后，页面请求库存基础信息，并打开“修改库存”弹窗。

弹窗可见字段：

```text
商品信息
属性集
当前库存
库存增减
修改后库存
```

**接口地址**

```http
POST https://agentseller.temu.com/darwin-mms/api/kiana/foredawn/sales/stock/queryMmsProductStockBaseInfo
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |
|                |                    |                                               |

**请求载荷**

本次浏览器实测该请求 `postData` 为空，页面根据当前行上下文打开库存弹窗：

```json
{}
```

**返回用途**


| 字段/数据  | 含义                   | 说明                              |
| ---------- | ---------------------- | --------------------------------- |
| 商品信息   | 当前被编辑的商品       | 弹窗左侧展示商品标题、属性等      |
| 属性集     | SKU 属性组合           | 如颜色/规格等                     |
| 当前库存   | 当前 SKU 库存          | 保存时带入`currentStockAvailable` |
| 库存增减   | 用户输入的库存变化量   | 本次探针填入`1`                   |
| 修改后库存 | 当前库存加减后的预览值 | 页面前端计算展示                  |

#### 3.1.3 保存库存修改

在“库存增减”输入框中填写数值后，点击弹窗底部“保存”触发库存保存接口。

本次取证填入：

```text
库存增减 = 1
```

**接口地址**

```http
POST https://agentseller.temu.com/darwin-mms/api/kiana/foredawn/sales/stock/updateMmsProductSalesStock
```

**请求头**


| 参数           | 值                 | 说明                                          |
| -------------- | ------------------ | --------------------------------------------- |
| `Content-Type` | `application/json` | 请求体为 JSON                                 |
| `Mallid`       | `634418220627643`  | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`  | 使用当前浏览器登录态；文档中不保存完整 Cookie |
|                |                    |                                               |

**请求载荷**

```json
{
  "productId": 2085695618,
  "skcVirtualStockChangeDTOList": [
    {
      "productSkcId": 45309684906,
      "stockUpdateSource": 1,
      "skuVirtualStockChangeList": [
        {
          "productSkuId": 55110889869,
          "currentStockAvailable": 8988,
          "virtualStockDiff": 1
        }
      ]
    }
  ]
}
```

**字段说明**


| 字段                           | 含义                 | 说明                                      |
| ------------------------------ | -------------------- | ----------------------------------------- |
| `productId`                    | 商品 ID              | 当前被编辑的商品                          |
| `skcVirtualStockChangeDTOList` | SKC 维度库存变更列表 | 支持一次提交多个 SKC                      |
| `productSkcId`                 | 商品 SKC ID          | 当前被编辑的 SKC                          |
| `stockUpdateSource`            | 库存修改来源         | 本次行内“修改库存”观察为`1`             |
| `skuVirtualStockChangeList`    | SKU 维度库存变更列表 | 同一 SKC 下可包含多个 SKU                 |
| `productSkuId`                 | 商品 SKU ID          | 当前被编辑的 SKU                          |
| `currentStockAvailable`        | 当前库存             | 保存请求带入页面展示的当前库存            |
| `virtualStockDiff`             | 库存增减值           | 正数表示增加，负数表示减少；本次探针为`1` |

**拦截结果**

```text
POST https://agentseller.temu.com/darwin-mms/api/kiana/foredawn/sales/stock/updateMmsProductSalesStock
Result: blockedbyclient
```

本次取证在点击“保存”后拦截并中止 `updateMmsProductSalesStock` 请求，因此未实际修改商品库存。

**注意事项**

- `updateMmsProductSalesStock` 是真实库存状态变更接口，自动化取证时必须在点击“保存”前挂好拦截。
- 请求体中的 `currentStockAvailable` 应使用打开弹窗时页面展示的当前库存，不应自行伪造。
- `virtualStockDiff` 是库存增减值，不是修改后的库存总数。
- 不要保存 Cookie、Authorization、anti-content、anti-token 或完整请求头；仅记录必要接口路径、方法、核心请求体结构和字段含义。

## 4. 申报核价

本节记录 `https://agentseller.temu.com/newon/product-select` 页面中“查看并确认申报价格”确认页相关接口。

本次取证页面：

```text
https://agentseller.temu.com/newon/product-select
```

本次取证商品：


| 字段           | 值                    |
| -------------- | --------------------- |
| `productId`    | `2633715872`          |
| `skcId`        | `70387465613`         |
| `priceOrderId` | `2605290665012577`    |
| `priceOrderSn` | `HJD2605290665012577` |
| `mallid`       | `634418220645967`     |

### 4.1 获取申报价格

点击商品行内“查看并确认申报价格”后，页面调用该接口获取申报价格确认抽屉数据。接口返回 SKC、SKU、原申报价格、调整后建议申报价格、站点、类目、可议价状态等信息。

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/magnus/mms/price/bargain-no-bom/batch/info/query
```

**请求头**


| 参数           | 值                                                  | 说明                                          |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `Content-Type` | `application/json`                                  | 请求体为 JSON                                 |
| `mallid`       | `634418220645967`                                   | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`                                   | 使用当前浏览器登录态；文档中不保存完整 Cookie |
| `Anti-Content` | `[动态风控字段]`                                    | 浏览器页面实时生成；不应落库或写入代码        |
| `Origin`       | `https://agentseller.temu.com`                      | 请求来源                                      |
| `Referer`      | `https://agentseller.temu.com/newon/product-select` | 商品上新生命周期管理页面                      |

**请求载荷**

```json
{
  "orderIds": [2605290665012577]
}
```

**返回示例**

```json
{
  "result": {
    "priceReviewItemList": [
      {
        "skcId": 70387465613,
        "priceOrderSn": "HJD2605290665012577",
        "autoRejectSimilar": false,
        "isApparel": false,
        "priceBeforeExchange": 7500,
        "skuInfoList": [
          {
            "productSkuId": 53601287015,
            "priceCurrency": "CNY",
            "currencyName": "人民币",
            "suggestPriceCurrency": "CNY",
            "suggestSupplyPrice": 4000,
            "productSkuExtCode": "AA-Y9524",
            "priceBeforeExchange": 7500,
            "spec": "Red cat-head BB clip"
          },
          {
            "productSkuId": 76619299447,
            "priceCurrency": "CNY",
            "currencyName": "人民币",
            "suggestPriceCurrency": "CNY",
            "suggestSupplyPrice": 4000,
            "productSkuExtCode": "AA-Y9525",
            "priceBeforeExchange": 7500,
            "spec": "Red cat-head X-shaped clip"
          }
        ],
        "productName": "Kitten hair clip for women, front and side bangs clip, 2025 new girly hair clip headwear",
        "semiHostedBindSiteList": [
          {
            "siteId": 100,
            "siteName": "美国站"
          }
        ],
        "catName": "女士装扮配饰套装",
        "suggestSupplyPrice": 4000,
        "id": 2605290665012577,
        "reviewTimes": 2,
        "productId": 2633715872,
        "semiHosted": true,
        "priceCurrency": "CNY",
        "semiHostedBindSiteIdList": [100],
        "semiHostedBindSiteNameList": ["美国站"],
        "canAppeal": true
      }
    ],
    "canBargainTime": null,
    "canBargain": true
  },
  "success": true,
  "errorCode": 1000000,
  "errorMsg": null
}
```

**字段说明**


| 字段                     | 含义                | 说明                                           |
| ------------------------ | ------------------- | ---------------------------------------------- |
| `orderIds`               | 申报价格单 ID 列表  | 对应返回中的`id` / 提交接口中的 `priceOrderId` |
| `priceReviewItemList`    | 申报价格确认项列表  | 一个订单可包含一个 SKC 及多个 SKU              |
| `skcId`                  | 商品 SKC ID         | 抽屉中展示的 SKC                               |
| `priceBeforeExchange`    | 原申报价格          | 单位为分；`7500` 表示 `¥75.00`                |
| `suggestSupplyPrice`     | 建议/调整后申报价格 | 单位为分；`4000` 表示 `¥40.00`                |
| `skuInfoList`            | SKU 明细列表        | 提交接口需要使用其中的`productSkuId` 和价格    |
| `productSkuId`           | 商品 SKU ID         | 提交接口`items[].productSkuId` 来源            |
| `productSkuExtCode`      | SKU 货号            | 页面展示用，如`AA-Y9524`                       |
| `semiHostedBindSiteList` | 绑定站点列表        | 本次为美国站                                   |
| `canBargain`             | 是否允许议价/确认   | `true` 表示当前可进行确认操作                  |

### 4.2 部分提交接口

在“查看并确认申报价格”抽屉左下角点击“全部提交(1项)”后，页面先弹出二次确认框；点击二次确认框中的“确认”后触发该接口。

本次取证在点击二次确认“确认”前已开启 Chrome DevTools `Fetch` 拦截，请求在发出前被中止，因此未实际提交申报价格，也没有服务端响应。

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/magnus/mms/price/bargain-no-bom/batch
```

**请求头**


| 参数           | 值                                                  | 说明                                          |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `Content-Type` | `application/json`                                  | 请求体为 JSON                                 |
| `mallid`       | `634418220645967`                                   | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`                                   | 使用当前浏览器登录态；文档中不保存完整 Cookie |
| `Anti-Content` | `[动态风控字段]`                                    | 浏览器页面实时生成；不应落库或写入代码        |
| `Origin`       | `https://agentseller.temu.com`                      | 请求来源                                      |
| `Referer`      | `https://agentseller.temu.com/newon/product-select` | 商品上新生命周期管理页面                      |

**请求载荷**

```json
{
  "itemRequests": [
    {
      "priceOrderId": 2605290665012577,
      "supplierResult": 1,
      "items": [
        {
          "productSkuId": 53601287015,
          "price": 4000
        },
        {
          "productSkuId": 76619299447,
          "price": 4000
        }
      ]
    }
  ]
}
```

**拦截结果**

```text
POST https://agentseller.temu.com/api/kiana/magnus/mms/price/bargain-no-bom/batch
Result: blockedbyclient
```

**字段说明**


| 字段             | 含义                     | 说明                                              |
| ---------------- | ------------------------ | ------------------------------------------------- |
| `itemRequests`   | 本次提交的申报价格确认项 | 支持一次提交多个价格单                            |
| `priceOrderId`   | 申报价格单 ID            | 来源于 4.1 接口返回的`id`                         |
| `supplierResult` | 商家处理结果             | 本次确认提交为`1`                                 |
| `items`          | SKU 提交明细             | 每个 SKU 带入确认后的申报价格                     |
| `productSkuId`   | 商品 SKU ID              | 来源于 4.1 接口返回的`skuInfoList[].productSkuId` |
| `price`          | 提交申报价格             | 单位为分；`4000` 表示 `¥40.00`                   |

**注意事项**

- `batch` 为真实写接口，会提交申报价格确认结果；自动化取证时必须在点击二次确认“确认”前挂好拦截。
- 不要保存完整 `Cookie`、`Anti-Content`、Authorization、anti-token 或其他可复用认证/风控字段。
- 提交价格应使用 4.1 接口返回或页面确认后的 SKU 价格，不应自行伪造。
- 本次响应缺失是预期结果，因为请求已被 `blockedbyclient` 中止。

## 5. 产品加站

本节记录 `https://agentseller.temu.com/newon/product-select` 页面中，快速筛选“商品信息待确认”刷新商品列表、商品表格第一行最右侧操作栏“去确认”进入确认商品信息页，以及确认页底部“确认商品信息并同意以上全部内容”的接口。

本次取证页面：

```text
https://agentseller.temu.com/newon/product-select
```

本次取证商品：


| 字段           | 值                |
| -------------- | ----------------- |
| `supplierId`   | `634418221582544` |
| `supplierName` | `Sweet Gift Jian` |
| `goodsId`      | `605624276468012` |
| `productId`    | `4743756489`      |
| `mallid`       | `634418221582544` |

### 5.1 快速筛选（商品列表）

点击“快速筛选”右侧的“商品信息待确认”后，页面会刷新商品表格。当前页面模式下，商品列表主接口为 `searchForChainSupplier`，快速筛选条件通过 `supplierTodoTypeList` 传入。

本次选中“商品信息待确认”时，页面表格返回 2 条商品数据。

**接口地址**

```http
POST https://agentseller.temu.com/api/kiana/mms/robin/searchForChainSupplier
```

**请求头**


| 参数           | 值                                                  | 说明                                          |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `Content-Type` | `application/json`                                  | 请求体为 JSON                                 |
| `mallid`       | `634418221582544`                                   | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`                                   | 使用当前浏览器登录态；文档中不保存完整 Cookie |
| `Anti-Content` | `[动态风控字段]`                                    | 浏览器页面实时生成；不应落库或写入代码        |
| `Origin`       | `https://agentseller.temu.com`                      | 请求来源                                      |
| `Referer`      | `https://agentseller.temu.com/newon/product-select` | 商品上新生命周期管理页面                      |

**请求载荷**

```json
{
  "pageSize": 10,
  "pageNum": 1,
  "removeStatus": 0,
  "supplierTodoTypeList": [6]
}
```

**返回示例**

```json
{
  "result": {
    "total": 2,
    "productSkcStatusAggregation": [],
    "productIdNoStatusTotal": 0,
    "dataList": [
      {
        "productId": 4743756489,
        "goodsId": 605624276468012,
        "supplierId": 634418221582544,
        "productName": "JIT [已授权]【Holiday Gifts】 1pcs SANRIO HelloKitty White shoes suitable for daily casual and sporty activities, suitable for all seasons to wear.",
        "supplierPrice": "¥30.00~69.00",
        "leafCategoryName": "女童运动鞋",
        "removeStatus": 0,
        "goodsInfoStatus": {
          "siteVersion": null,
          "deadLineTime": 1782917261307,
          "confirmTime": null,
          "supplierConfirmStatus": 21
        },
        "skcList": [
          {
            "skcId": 53947613553,
            "sampleType": 1,
            "canOnSale": false,
            "canOffSale": true,
            "selectStatus": 12
          }
        ]
      }
    ]
  },
  "success": true,
  "errorCode": 1000000,
  "errorMsg": null
}
```

**字段说明**


| 字段                                    | 含义              | 说明                                             |
| --------------------------------------- | ----------------- | ------------------------------------------------ |
| `pageSize`                              | 每页数量          | 本次页面请求为`10`                               |
| `pageNum`                               | 页码              | 本次为第一页                                     |
| `removeStatus`                          | 删除/下架筛选状态 | 本次为`0`                                        |
| `supplierTodoTypeList`                  | 快速筛选待办类型  | `[6]` 表示“商品信息待确认”；取消筛选时为空数组 |
| `total`                                 | 命中商品总数      | 本次为`2`                                        |
| `dataList`                              | 商品表格数据列表  | 页面商品表格主要数据来源                         |
| `goodsInfoStatus.supplierConfirmStatus` | 商家确认状态      | 本次第一条为`21`，页面展示为“上新待确认”       |
| `goodsInfoStatus.deadLineTime`          | 自动确认截止时间  | 页面展示为倒计时文案                             |
| `skcList`                               | SKC 列表          | 后续补充接口会使用其中的`skcId`                  |

**相关数量接口**

点击快速筛选时会同时刷新待办数量和快速筛选数量。

```http
POST https://agentseller.temu.com/api/kiana/mms/robin/querySupplierTodoCount
```

请求体：

```json
{}
```

返回示例：

```json
{
  "result": {
    "todoStatusAggregationList": null,
    "total": 0
  },
  "success": true,
  "errorCode": 1000000,
  "errorMsg": null
}
```

```http
POST https://agentseller.temu.com/api/kiana/mms/robin/querySupplierQuickFilterCount
```

请求体：

```json
{}
```

返回示例：

```json
{
  "result": {
    "countList": [
      { "count": 0, "type": 0 },
      { "count": 0, "type": 1 },
      { "count": 0, "type": 2 },
      { "count": 0, "type": 3 },
      { "count": 0, "type": 4 },
      { "count": 2, "type": 6 },
      { "count": 0, "type": 7 },
      { "count": 1, "type": 12 },
      { "count": 0, "type": 16 },
      { "count": 122, "type": 19 }
    ]
  },
  "success": true,
  "errorCode": 1000000,
  "errorMsg": null
}
```

本次观察中 `type: 6` 对应“商品信息待确认”。

**列表补充接口**

商品列表主接口返回后，页面会按列表中的商品/SKU/SKC 继续请求补充信息。

```http
POST https://agentseller.temu.com/api/kiana/mms/robin/queryFullyOtherMessage
```

请求载荷：

```json
{
  "goodsIdSkuIdPairList": [
    {
      "goodsId": 605624276468012,
      "skuIdList": [
        88817105131972,
        88817105164740,
        88817105123780,
        88817105163716
      ]
    },
    {
      "goodsId": 606037079899394,
      "skuIdList": [
        90391479094383,
        90391479077999,
        90391479110767,
        90391479091823
      ]
    }
  ]
}
```

返回用途：


| 字段                         | 含义              | 说明                             |
| ---------------------------- | ----------------- | -------------------------------- |
| `fullyGoodsRejectSaleInfoVO` | 商品禁售/拒售信息 | 页面站点异常、禁售站点等信息来源 |
| `fullyBindSiteFailVO`        | SKU 加站失败信息  | 包含各 SKU 在不同站点的失败原因  |

```http
POST https://agentseller.temu.com/visage-agent-seller/product/skc/bom/batchQuery
```

请求载荷：

```json
{
  "productSkcIds": [53947613553, 70814808695]
}
```

返回用途：


| 字段                      | 含义               | 说明             |
| ------------------------- | ------------------ | ---------------- |
| `supportBomProductSkcIds` | 支持 BOM 的 SKC ID | 本次返回为空数组 |
| `list`                    | BOM 信息列表       | 本次返回为空数组 |

**注意事项**

- 当前页面模式下，商品列表主接口是 `searchForChainSupplier`；另一个页面模式可能使用 `searchForSemiSupplier`。
- “商品信息待确认”的快速筛选值为 `supplierTodoTypeList: [6]`。
- 快速筛选卡片是开关行为，取消筛选时 `supplierTodoTypeList` 会变为空数组。
- 列表补充接口依赖主接口返回的 `goodsId`、SKU ID 和 `skcId`，应从当前页数据中提取，不要跨页复用。

### 5.2 去确认（获取信息）

点击商品表格第一行最右侧操作栏下的“去确认”后，页面调用该接口获取确认商品信息页数据。接口返回商品基础信息、多语言商品名、属性、SKU/SKC、尺码表、图文详情、Q&A、卖点、站点确认状态等内容，用于渲染“确认商品信息”抽屉。

**接口地址**

```http
POST https://agentseller.temu.com/bg-brando-mms/goods/queryOnlineGoodsForGoodsCommitConfirm
```

**请求头**


| 参数           | 值                                                  | 说明                                          |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `Content-Type` | `application/json`                                  | 请求体为 JSON                                 |
| `mallid`       | `634418221582544`                                   | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`                                   | 使用当前浏览器登录态；文档中不保存完整 Cookie |
| `Anti-Content` | `[动态风控字段]`                                    | 浏览器页面实时生成；不应落库或写入代码        |
| `Origin`       | `https://agentseller.temu.com`                      | 请求来源                                      |
| `Referer`      | `https://agentseller.temu.com/newon/product-select` | 商品上新生命周期管理页面                      |

**请求载荷**

```json
{
  "goodsId": 605624276468012,
  "supplierId": 634418221582544
}
```

**返回示例**

```json
{
  "success": true,
  "errorCode": 1000000,
  "errorMsg": null,
  "result": {
    "goodsDetail": {
      "supplierId": 634418221582544,
      "supplierName": "Sweet Gift Jian",
      "goodsId": 605624276468012,
      "productId": 4743756489,
      "goodsI18nList": [
        {
          "goodsId": 605624276468012,
          "language": "en",
          "goodsName": "SANRIO Hellokitty White Shoes Suitable for Daily Casual And Sporty Activities, for All Seasons Wear"
        }
      ],
      "propertyVOListMap": {},
      "skcDetailVOS": [],
      "supplierConfirmSiteCountries": [],
      "bindSiteConfirmStatus": null,
      "goodsModifyConfirmStatus": null,
      "priceManualConfirmed": null,
      "priceConfirmKey": null,
      "priceConfirmKeyStr": null
    },
    "goodsDetailAfter": {},
    "supplierConfirmStatus": null,
    "confirmSource": null,
    "siteVerison": 0,
    "goodsCommitId": null,
    "goodsCommitVersion": null,
    "rejectGoodsNameStatus": null,
    "rejectGoodsNameI18nList": null
  }
}
```

**字段说明**


| 字段                           | 含义               | 说明                             |
| ------------------------------ | ------------------ | -------------------------------- |
| `goodsId`                      | 商品资料 ID        | 打开确认页和提交确认均使用该值   |
| `supplierId`                   | 供应商/店铺主体 ID | 本次与`mallid` 一致              |
| `goodsDetail`                  | 当前商品信息详情   | 确认页主要展示数据来源           |
| `goodsDetailAfter`             | 变更后的商品信息   | 用于展示待确认变更后的内容       |
| `goodsI18nList`                | 多语言商品名列表   | 确认页商品名称模块使用           |
| `propertyVOListMap`            | 商品属性映射       | 确认页商品属性模块使用           |
| `skcDetailVOS`                 | SKC/SKU 详情       | 确认页 SKU 信息模块使用          |
| `supplierConfirmSiteCountries` | 待确认站点/国家    | 与加站确认范围相关               |
| `siteVerison`                  | 站点版本           | 提交接口中的`siteVersion` 来源   |
| `priceConfirmKeyStr`           | 价格确认键         | 提交接口会原样带入；本次为`null` |

### 5.3 提交接口

在“确认商品信息”抽屉底部点击“确认商品信息并同意以上全部内容”后，页面触发该接口提交确认结果。

本次取证在点击按钮前已开启 Chrome DevTools `Fetch` 拦截，请求在发出前被中止，因此未实际确认商品信息，也没有服务端响应。

**接口地址**

```http
POST https://agentseller.temu.com/bg-brando-mms/goods/bindSiteConfirmForPrice
```

**请求头**


| 参数           | 值                                                  | 说明                                          |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `Content-Type` | `application/json`                                  | 请求体为 JSON                                 |
| `mallid`       | `634418221582544`                                   | 当前店铺/主体 ID                              |
| `Cookie`       | `[登录态 Cookie]`                                   | 使用当前浏览器登录态；文档中不保存完整 Cookie |
| `Anti-Content` | `[动态风控字段]`                                    | 浏览器页面实时生成；不应落库或写入代码        |
| `Origin`       | `https://agentseller.temu.com`                      | 请求来源                                      |
| `Referer`      | `https://agentseller.temu.com/newon/product-select` | 商品上新生命周期管理页面                      |

**请求载荷**

```json
{
  "goodsId": 605624276468012,
  "siteVersion": 0,
  "priceConfirmKeyStr": null,
  "goodsSkuIdList": [
    88817105131972,
    88817105164740,
    88817105123780,
    88817105156548,
    88817105140164,
    88817105172932,
    88817105110468,
    88817105143236,
    88817105126852,
    88817105159620,
    88817105118660,
    88817105151428,
    88817105135044,
    88817105167812,
    88817105114564,
    88817105147332,
    88817105130948,
    88817105163716
  ]
}
```

**拦截结果**

```text
POST https://agentseller.temu.com/bg-brando-mms/goods/bindSiteConfirmForPrice
Result: blockedbyclient
```

**字段说明**


| 字段                 | 含义             | 说明                                                                 |
| -------------------- | ---------------- | -------------------------------------------------------------------- |
| `goodsId`            | 商品资料 ID      | 来源于 5.2 接口返回的`goodsDetail.goodsId`                           |
| `siteVersion`        | 站点版本         | 来源于 5.2 接口返回的`siteVerison`；注意接口字段拼写为 `siteVerison` |
| `priceConfirmKeyStr` | 价格确认键       | 来源于 5.2 接口返回的`goodsDetail.priceConfirmKeyStr`；本次为 `null` |
| `goodsSkuIdList`     | 商品 SKU ID 列表 | 本次提交包含 18 个 SKU                                               |

**注意事项**

- `bindSiteConfirmForPrice` 为真实写接口，会确认商品信息并影响加站/发布流程；自动化取证时必须在点击底部确认按钮前挂好拦截。
- 不要保存完整 `Cookie`、`Anti-Content`、Authorization、anti-token 或其他可复用认证/风控字段。
- `siteVersion` 应使用 5.2 接口返回的版本值，不应自行伪造。
- `goodsSkuIdList` 应使用确认页当前商品的 SKU 列表，不应跨商品复用。
- 本次响应缺失是预期结果，因为请求已被 `blockedbyclient` 中止。
