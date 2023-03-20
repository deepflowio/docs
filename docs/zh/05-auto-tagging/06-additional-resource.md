---
title: 手动注入
permalink: /auto-tagging/additional-resource
---

# 简介

DeepFlow 提供接口以实现手动注入资源和手动打标签的功能，支持的资源包括：

手动注入的资源：
- 可用区
- VPC
- 子网
- 服务器
- 云服务器
- 负载均衡器


手动打标签的资源：
- K8s 资源
  - 命名空间
- 云资源
  - 云服务器


# 更新历史
版本：v 1.0.1

发布时间：2023 年 3 月 9 日

| 类型 | 说明                             |
| ---- | -------------------------------- |
| 新增 | load balance 部分                |
| 新增 | domain-additional-resources 接口 |


# 调用方法

## 接口
```shell
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/
```

## 请求方式

PUT

## 请求参数

### Header
| 名称         | 类型   | 是否必填 | 说明             |
| ------------ | ------ | -------- | ---------------- |
| Content-Type | 字符串 | 是       | application/json |


### body

| 名称       | 类型                | 是否必填 | 说明                        |
| ---------- | ------------------- | -------- | --------------------------- |
| azs        | AZ 结构体数组       | 否       | availability zone（可用区） |
| vpcs       | VPC 结构体数组      | 否       | virtual private cloud       |
| subnets    | Subnet 结构体数组   | 否       | 子网                        |
| hosts      | Host 结构体数组     | 否       | 服务器                      |
| chosts     | Chost 结构体数组    | 否       | 云服务器                    |
| cloud_tags | CloudTag 结构体数组 | 否       |                             |
| lbs        | LB 结构体数组       | 否       | load balance                |



AZ 结构体
| 名称        | 类型   | 是否必填 | 说明        |
| ----------- | ------ | -------- | ----------- |
| name        | 字符串 | 是       |             |
| uuid        | 字符串 | 是       |             |
| domain_uuid | 字符串 | 是       | 云平台 UUID |


VPC 结构体
| 名称        | 类型   | 是否必填 | 说明        |
| ----------- | ------ | -------- | ----------- |
| name        | 字符串 | 是       |             |
| uuid        | 字符串 | 是       |             |
| domain_uuid | 字符串 | 是       | 云平台 UUID |


Subnet 结构体
| 名称        | 类型       | 是否必填 | 说明                              |
| ----------- | ---------- | -------- | --------------------------------- |
| name        | 字符串     | 是       |                                   |
| uuid        | 字符串     | 是       |                                   |
| type        | 整型       | 否       | 默认值: 4，可选：3 (WAN)，4 (LAN) |
| is_vip      | 布尔       | 否       | 可选：true，false                 |
| vpc_uuid    | 字符串     | 是       |                                   |
| az_uuid     | 字符串     | 否       |                                   |
| domain_uuid | 字符串     | 是       | 云平台 UUID                       |
| cidrs       | 字符串数组 | 是       | 例如：["x.x.x.x/x"]               |


Host 结构体
| 名称        | 类型                    | 是否必填 | 说明                                                               |
| ----------- | ----------------------- | -------- | ------------------------------------------------------------------ |
| name        | 字符串                  | 是       |                                                                    |
| uuid        | 字符串                  | 是       |                                                                    |
| ip          | 字符串                  | 是       |                                                                    |
| type        | 整型                    | 否       | 默认值: 3(KVM)。 可选：2 (ESXi), 3 (KVM), 5 (Hyper-V), 6 (Gateway) |
| az_uuid     | 字符串                  | 是       |                                                                    |
| domain_uuid | 字符串                  | 是       | 云平台 UUID                                                        |
| vinterfaces | Vinterface 1 结构体数组 | 否       | network interfaces                                                 |


Vinterface 1 结构体
| 名称        | 类型       | 是否必填 | 说明                  |
| ----------- | ---------- | -------- | --------------------- |
| mac         | 字符串     | 是       | 例：xx:xx:xx:xx:xx:xx |
| subnet_uuid | 字符串     | 是       |                       |
| ips         | 字符串数组 | 否       | 例：["x.x.x.x"]       |


Chost 结构体
| 名称        | 类型                    | 是否必填 | 说明                                                                                                                        |
| ----------- | ----------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| name        | 字符串                  | 是       |                                                                                                                             |
| uuid        | 字符串                  | 是       |                                                                                                                             |
| host_ip     | 字符串                  | 否       | hypervisor IP address                                                                                                       |
| type        | 整型                    | 否       | 默认值: 1(vm/compute)。可选: 1 (vm/compute), 2 (bm/compute), 3 (vm/network), 4 (bm/network), 5 (vm/storage), 6 (bm/storage) |
| vpc_uuid    | 字符串                  | 是       |                                                                                                                             |
| az_uuid     | 字符串                  | 是       |                                                                                                                             |
| domain_uuid | 字符串                  | 是       | 云平台 UUID                                                                                                                 |
| vinterfaces | Vinterface 2 结构体数组 | 否       | chost interfaces                                                                                                            |

Vinterface 2 结构体
| 名称        | 类型       | 是否必填 | 说明                  |
| ----------- | ---------- | -------- | --------------------- |
| mac         | 字符串     | 是       | 例：xx:xx:xx:xx:xx:xx |
| subnet_uuid | 字符串     | 是       |                       |
| ips         | 字符串数组 | 是       | 例：["x.x.x.x"]       |


CloudTag 结构体
| 名称          | 类型           | 是否必填 | 说明                                                     |
| ------------- | -------------- | -------- | -------------------------------------------------------- |
| resource_type | 字符串         | 是       | 可选：chost 和 pod_ns（pod namespace）                   |
| resource_name | 字符串         | 是       | 资源名，从 vm.name 或 pod_namespace.name 中获取          |
| domain_uuid   | 字符串         | 是       | 云平台 UUID，从 vm.domain 或 pod_namespace.domain 中获取 |
| tags          | Tag 结构体数组 | 是       | 需要打标签的信息                                         |

Tag 结构体
| 名称  | 类型   | 是否必填 | 说明                                                    |
| ----- | ------ | -------- | ------------------------------------------------------- |
| key   | 字符串 | 是       | 限制 255 字符，不支持空格、冒号、反引号、反斜杠、单引号 |
| value | 字符串 | 是       | 限制 255 字符，不支持空格、冒号、反引号、反斜杠         |

LB 结构体
| 名称         | 类型                    | 是否必填 | 说明                                         |
| ------------ | ----------------------- | -------- | -------------------------------------------- |
| name         | 字符串                  | 是       |                                              |
| model        | 整型                    | 是       | 默认值: 2。 可选: 1 (internal), 2 (external) |
| vpc_uuid     | 字符串                  | 是       |                                              |
| domain_uuid  | 字符串                  | 是       |                                              |
| vinterfaces  | Vinterface 2 结构体数组 | 否       | chost interfaces                             |
| lb_listeners | LBListener 结构体数组   | 否       |                                              |

 LBListener 结构体
| 名称              | 类型                      | 是否必填 | 说明                         |
| ----------------- | ------------------------- | -------- | ---------------------------- |
| name              | 字符串                    | 否       | 若为空，则赋值 ${ip}-${port} |
| protocol          | 字符串                    | 是       | 可选: TCP,  UDP              |
| ip                | 整型                      | 是       |                              |
| port              | 字符串                    | 是       |                              |
| lb_target_servers | LBTargetServer 结构体数组 | 否       |                              |


LBTargetServer 结构体
| 名称 | 类型   | 是否必填 | 说明 |
| ---- | ------ | -------- | ---- |
| ip   | 字符串 | 是       |      |
| port | 整型   | 是       |      |

## 响应结果

### 返回参数
| 名称        | 类型   | 是否必填 | 说明     |
| ----------- | ------ | -------- | -------- |
| OPT_STATUS  | 字符串 | 是       | 成功与否 |
| DESCRIPTION | 字符串 | 是       | 错误信息 |
| DATA        | JSON   | 是       | 返回数据 |


### 成功响应
当返回参数 OPT_STATUS 等于 SUCCESS 时，表明调用成功。返回值示例如下：
```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "DATA": {}
}
```

### 失败响应
当返回参数 OPT_STATUS 不等于 SUCCESS 时，表明调用失败。返回值示例如下：
```json
{
  "OPT_STATUS": "INVALID_POST_DATA",
  "DESCRIPTION": "cloud tag (resource name: deepflow) domain (uuid: 76b5d56a-a65d-58db-bd49-e04585529ce5) not found",
  "DATA": null
}
```

## 请求示例

### HTTP 请求方式

```shell
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

参数文件 additional_resource.json （[参考 YAML 文件](https://github.com/deepflowio/deepflow/blob/main/cli/ctl/example/domain_additional_resource.yaml)）
```json
{
    "azs": [
        {
            "name": "xxxx",
            "uuid": "xxxx",
            "domain_uuid": "xxxx"
        }
    ],
    "vpcs": [
        {
            "name": "xxxx",
            "uuid": "xxxx",
            "domain_uuid": "xxxx"
        }
    ],
    "subnets": [
        {
            "name": "xxxx",
            "uuid": "xxxx",
            "type": 3,
            "is_vip": false,
            "vpc_uuid": "xxxx",
            "az_uuid": "xxxx",
            "domain_uuid": "xxxx",
            "cidrs": [
                "x.x.x.x/x"
            ]
        }
    ],
    "hosts": [
        {
            "name": "xxxx",
            "uuid": "xxxx",
            "ip": "x.x.x.x",
            "type": 3,
            "az_uuid": "xxxx",
            "domain_uuid": "xxxx",
            "vinterfaces": [
                {
                    "mac": "xx:xx:xx:xx:xx:xx",
                    "subnet_uuid": "xxxx",
                    "ips": [
                        "x.x.x.x"
                    ]
                }
            ]
        }
    ],
    "chosts": [
        {
            "name": "xxxx",
            "uuid": "xxxx",
            "host_ip": "x.x.x.x",
            "type": 1,
            "vpc_uuid": "xxxx",
            "az_uuid": "xxxx",
            "domain_uuid": "xxxx",
            "vinterfaces": [
                {
                    "mac": "xx:xx:xx:xx:xx:xx",
                    "subnet_uuid": "xxxx",
                    "ips": [
                        "x.x.x.x"
                    ]
                }
            ]
        }
    ],
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
    "lbs": [
        {
            "name": "xxx",
            "model": 2,
            "vpc_uuid": "xxxx",
            "domain_uuid": "xxxx",
            "region_uuid": "xxxx",
            "vinterfaces": [
                {
                    "mac": "xx:xx:xx:xx:xx:xx",
                    "subnet_uuid": "xxxx",
                    "ips": [
                        "x.x.x.x"
                    ]
                }
            ],
            "lb_listeners": [
                {
                    "name": "xxx",
                    "protocol": "TCP/UDP",
                    "ip": "x.x.x.x",
                    "port": 9000,
                    "lb_target_servers": [
                        {
                            "ip": "x.x.x.x",
                            "port": 9090
                        }
                    ]
                }
            ]
        }
    ]
}
```

### deepflow-ctl 命令方式

```shell
# 查看 yaml 参数示例
deepflow-ctl domain additional-resource example

# 建立 additional-resource.yaml 文件
deepflow-ctl domain additional-resource example > additional-resource.yaml

# 添加对应的参数后执行命令
deepflow-ctl domain additional-resource apply -f additional-resource.yaml
```

资源手动添加成功后，1 分钟后（取决于 server.yaml 配置文件的 resource_recorder_interval 字段）对应的数据库表就能查看到信息：
- 可用区（表 az）
- VPC（表 epc）
- 子网（表 subnet）
- 服务器（表 host_device）
- 云服务器（表 vm）
- 负载均衡器（表 lb、lb_listener 和 lb_target_server）
- 命名空间（表 pod_namespace）

## 错误码
错误码为返回值中 OPT_STATUS 字段的信息
| 错误码             | 说明       | 建议解决办法                         |
| ------------------ | ---------- | ------------------------------------ |
| INVALID_POST_DATA  | 无效参数   | 根据错误提示检查对应字段的值是否正确 |
| RESOURCE_NOT_FOUND | 资源未发现 | 填写的资源值无效，请检查后填写正确   |

