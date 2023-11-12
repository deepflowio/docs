---
title: 注入 CMDB 中的业务标签
permalink: /features/auto-tagging/cmdb-tags
---

当我们希望将 CMDB 中的业务标签信息与观测信号进行关联时，可以使用 DeepFlow 的 `domain-additional-resources` 声明式 API。该 API 的详细使用说明请参考[额外的云资源标签](./additional-cloud-tags/)章节，本章节主要介绍如何利用其中的 `cloud_tags` 资源同步 CMDB 中的业务标签。

通过该 API，我们可以实现如下的效果：
- 将**云服务器**的业务、应用、服务、负责人等标签注入至 DeepFlow 的所有观测信号中
- 将 **K8s 命名空间**的业务、应用等标签注入至 DeepFlow 的所有观测信号中

# API 中的字段定义

CloudTag 结构体定义如下：
| 名称          | 类型           | 是否必填 | 说明                                                     |
| ------------- | -------------- | -------- | -------------------------------------------------------- |
| resource_type | 字符串         | 是       | 可选：chost 和 pod_ns（pod namespace）                   |
| resource_name | 字符串         | 是       | 资源名，从 vm.name 或 pod_namespace.name 中获取          |
| domain_uuid   | 字符串         | 是       | 云平台 UUID，从 vm.domain 或 pod_namespace.domain 中获取 |
| tags          | Tag 结构体数组 | 是       | 需要打标签的信息                                         |

其中，Tag 结构体的定义如下：
| 名称  | 类型   | 是否必填 | 说明                                                    |
| ----- | ------ | -------- | ------------------------------------------------------- |
| key   | 字符串 | 是       | 限制 255 字符，不支持空格、冒号、反引号、反斜杠、单引号 |
| value | 字符串 | 是       | 限制 255 字符，不支持空格、冒号、反引号、反斜杠         |

# 调用示例

具体的调用方法请参考[额外的云资源标签](./additional-cloud-tags/)章节，本章节主要介绍其中的 cloud_tags 部分。

## 通过 HTTP API 调用

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

```json
{
    // 注意：本 API 为声明式 API，请注意携带 API 中的其他资源信息（若有）
    // "azs": [],
    // "vpcs": [],
    // ...

    "cloud_tags": [
        {
            "resource_type": "xxxx",
            "resource_name": "xxxx",
            "domain_uuid": "xxxx",
            "tags": [
                {
                    "key": "xxxx",
                    "value": "xxxx"
                }
            ]
        }
    ],

    // ...
}
```

## 通过 deepflow-ctl 命令调用

```yaml
## 注意：本 API 为声明式 API，请注意携带 API 中的其他资源信息（若有）
#azs: []
#vpcs: []
#...

cloud_tags:
- resource_type: xxxx  # required. options: chost, pod_ns
  resource_name: xxxx  # required. (If there is a duplicate name, one will be chosen at random.)
  domain_uuid: xxxx    # required
  subdomain_uuid:      # optional. (Fill in this value if you need to set cloud tags for subdomain)
  tags:                # required
  - key: xxxx          # required. (Limited to 255 characters and does not support spaces, colon, back quotes, backslash, single quotes.)
    value: xxxx        # required. (Limited to 255 characters and does not support spaces, colon, back quotes, backslash.)
```
