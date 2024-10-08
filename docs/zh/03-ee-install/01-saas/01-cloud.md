---
title: 在 DeepFlow 中录入云平台
permalink: /ee-install/saas/cloud
---

# 简介

在 DeepFlow 的 Web 页面录入云平台，并完成云平台 API 接口的对接是如下 DeepFlow 功能运行的前提条件：

- 学习公有云的云服务器实例信息，以接纳云服务器内所部署的 DeepFlow Agent 的注册请求。
- 学习公有云的 VPC、负载均衡器、RDS 等资源和标签信息，对 DeepFlow Agent 采集的观测数据自动化注入`云资源`标签。

本章节将详细介绍如何在 DeepFlow 的 Web 页面中录入云平台信息以完成云平台 API 的对接。
完成录入后，DeepFlow 将自动根据您配置的云平台信息，通过云平台提供的 API 接口周期性同步云资源信息并构建 DeepFlow 的可观测性数据标签。

# 交互拓扑

![交互拓扑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407156694c77d6f050.jpeg)

# 支持的云服务商

DeepFlow 目前支持如下公有云的 API 对接和云资源信息同步：
| 云服务商（英文） | 云服务商（中文） | DeepFlow 中使用的类型标识 |
| ---------------- | ---------------- | ------------------------ |
| AWS | AWS | aws |
| Aliyun | 阿里云 | aliyun |
| Baidu Cloud | 百度云 | baidu_bce |
| Huawei Cloud | 华为云 | huawei |
| Microsoft Azure | 微软云 | |
| QingCloud | 青云 | qingcloud |
| Tencent Cloud | 腾讯云 | tencent |
| Volcengine | 火山引擎 | volcengine |

# 阿里云

## 录入步骤

1. 进入`资源`-`资源池`-`云平台`
2. 点击`新建云平台`
3. 填写云平台相关信息，点击`确定`，得到一条云平台的记录

![录入云平台（阿里云）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a7076882c.png)

## 配置项说明

| 配置项           | 填写内容                               | 备注                                                            |
| ---------------- | -------------------------------------- | --------------------------------------------------------------- |
| 云平台名称       | 例：`my-aliyun`                        | 在 DeepFlow 中看到的云平台的名称，可自定义                      |
| AccessKey ID     | 例：`LTAI4FiU3ad3txLUSRg8xGfn`         | 请在阿里云控制台创建 AccessKey，并将 ID 填写在此                |
| AccessKey Secret | 例：`itsHzkPo22jbtNZ61QEz3gc5bsPnXP`   | 请在阿里云控制台创建 AccessKey，并将 Secret 填写在此            |
| 区域白名单       | 例：`华南3（广州）, 华北6（乌兰察布）` | 填写为阿里云 ECS 资源所在的区域列表，多个区域之间使用 `, ` 连接 |

::: warning
`区域白名单`需填写，且与实际的云服务器资源分布一致。如果`区域白名单`为空（匹配全部区域）或过多，会产生 DeepFlow 查询过多的阿里云区域、查询周期长等情况。如果填写的区域未包含您的云服务器所在的区域，则会产生无法学习到该区域的云服务器信息，以及 DeepFlow Agent 无法注册等情况。
:::

**在阿里云控制台创建 AccessKey 的操作步骤**：

![在阿里云控制台创建 AccessKey](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a59992c.png)

**查询阿里云资源所在区域的操作步骤**：

![查询阿里云资源所在的区域](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a9687e6.png)

## API 权限说明

DeepFlow 会使用如下 API 从阿里云对接学习资源信息，如果需要限制 DeepFlow 能够学习的资源项，可在阿里云控制台限制用于生成 AccessKey 的账号的资源权限：

| 产品     | API                           | 权限                    | 对接内容                 | 是否必需项 |
| -------- | ----------------------------- | ----------------------- | ------------------------ | ---------- |
| Vpc      | DescribeRegions               | AliyunVPCReadOnlyAccess | 查询区域列表             | 必需项     |
| Vpc      | DescribeVpcs                  | AliyunVPCReadOnlyAccess | 查询 VPC 列表            | 必需项     |
| Vpc      | DescribeVSwitches             | AliyunVPCReadOnlyAccess | 查询交换机列表           | 必需项     |
| Ecs      | DescribeInstances             | AliyunECSReadOnlyAccess | 查询云服务器实例列表     | 必需项     |
| Ecs      | DescribeNetworkInterfaces     | AliyunECSReadOnlyAccess | 查询云服务器网络接口列表 | 必需项     |
| Vpc      | DescribeNatGateways           | AliyunVPCReadOnlyAccess | 查询 NAT 网关列表        | 非必需项   |
| Vpc      | DescribeSnatTableEntries      | AliyunVPCReadOnlyAccess | 查询 NAT 网关 SNAT 规则  | 非必需项   |
| Vpc      | DescribeForwardTableEntries   | AliyunVPCReadOnlyAccess | 查询 NAT 网关 DNAT 规则  | 非必需项   |
| Slb      | DescribeLoadBalancers         | AliyunSLBReadOnlyAccess | 查询负载均衡器           | 非必需项   |
| Slb      | DescribeLoadBalancerAttribute | AliyunSLBReadOnlyAccess | 查询负载均衡监听器       | 非必需项   |
| Slb      | DescribeHealthStatus          | AliyunSLBReadOnlyAccess | 查询负载均衡规则         | 非必需项   |
| 容器服务 | DescribeClusters              | AliyunCSReadOnlyAccess  | 查询集群列表             | 非必需项   |

# 腾讯云

## 录入步骤

1. 进入`资源`-`资源池`-`云平台`
2. 点击`新建云平台`
3. 填写云平台相关信息，点击`确定`，得到一条云平台的记录

![录入云平台（腾讯云）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a705b08bb.png)

## 配置项说明

| 配置项           | 填写内容                              | 备注                                                                                            |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 云平台名称       | 例：tencent-1                         | 在 DeepFlow 中看到的云平台的名称，可自定义                                                      |
| AccessKey ID     | 例：AKIDztZ0C9dHuIQJwKMeZEixykjTBhz2L | 填写腾讯云`访问管理`-`访问密钥`-`API密钥管理`页面中`新建密钥`后产生的`SecretId`（只读权限即可） |
| AccessKey Secret | 例：itsHzkPo22jbtNZ61QEz3gc5bsPnXP    | 填写`SecretId`对应的`SecretKey`（只读权限即可）                                                 |
| 区域白名单       | 例：华东地区(上海)                    | 填写为腾讯云 云服务器所在的区域列表，可以配置多个，不支持正则表达式，多个区域之间使用 `, ` 连接 |

::: warning
`区域白名单`需填写，且与实际的云服务器资源分布一致。如果`区域白名单`为空（匹配全部区域）或过多，会产生 DeepFlow 查询过多的腾讯云区域、查询周期长等情况。如果填写的区域未包含您的云服务器所在的区域，则会产生无法学习到该区域的云服务器信息，以及 DeepFlow Agent 无法注册等情况。
:::
::: tip
腾讯云`区域`列表包括：华南地区(广州),华东地区(南京),华北地区(北京),西南地区(成都),西南地区(重庆),港澳台地区(中国香港),亚太东北(首尔),亚太东北(东京),亚太东南(新加坡),亚太东南(曼谷),亚太东南(雅加达),美国西部(硅谷),欧洲地区(法兰克福),亚太南部(孟买),美国东部(弗吉尼亚),南美地区(圣保罗),北美地区(多伦多)
:::

**在腾讯云控制台创建密钥的操作步骤**：

![在腾讯云控制台创建密钥](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240719669a41be51191.png)

## API 权限说明

DeepFlow 会使用如下 API 从腾讯云对接学习资源信息，如果需要限制 DeepFlow 能够学习的资源项，可在腾讯云控制台限制用于生成密钥的账号的资源权限：

| API                                                    | 对接内容                       | 是否必需项 |
| ------------------------------------------------------ | ------------------------------ | ---------- |
| DescribeRegions                                        | 查询区域列表                   | 必需项     |
| DescribeZones                                          | 查询可用区列表                 | 必需项     |
| DescribeVpcs                                           | 查询 VPC 列表                  | 必需项     |
| DescribeNatGateways                                    | 查询 NAT 网关及相关信息        | 必需项     |
| DescribeNatGatewayDestinationIpPortTranslationNatRules | 查询 NAT 网关规则              | 必需项     |
| DescribeRouteTables                                    | 查询路由表                     | 必需项     |
| DescribeSubnets                                        | 查询子网列表                   | 必需项     |
| DescribeInstances                                      | 查询实例列表                   | 必需项     |
| DescribeNetworkInterfaces                              | 查询弹性网卡列表               | 必需项     |
| DescribeLoadBalancers                                  | 查询负载均衡器列表             | 必需项     |
| DescribeListeners                                      | 查询负载均衡的监听器列表       | 必需项     |
| DescribeTargets                                        | 查询负载均衡绑定的后端服务列表 | 必需项     |
| DescribeClassicalLBListeners                           | 查询传统型负载均衡监听器列表   | 必需项     |
