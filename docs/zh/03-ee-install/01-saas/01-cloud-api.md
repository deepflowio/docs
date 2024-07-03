---
title: 在 DeepFlow 中录入云平台
permalink: /ee-install/saas/cloud
---

# 简介

在 DeepFlow 的 Web 页面录入云平台，并完成云平台 API 接口的对接是如下 DeepFlow 功能运行的前提条件：
- 学习公有云的云服务器实例信息，以接纳云服务器内所部署的 DeepFlow Agent 的注册请求。
- 学习公有云的区域、可用区、VPC、子网及其他相关的资源信息和标签信息，对 DeepFlow Agent 采集的观测数据自动化注入`云资源`标签。

本章节将详细介绍如何在 DeepFlow 的 Web 页面中录入云平台信息以完成云平台 API 的对接。
完成录入后，DeepFlow 将自动根据您配置的云平台信息，通过云平台提供的 API 接口周期性同步云资源信息并构建 DeepFlow 的可观测性数据标签。

# 录入云平台

DeepFlow 目前支持如下公有云的 API 对接和云资源信息同步：
| 云服务商（英文） | 云服务商（中文） | DeepFlow 中使用的类型标识 |
| ---------------- | ---------------- | ------------------------ |
| AWS | AWS | aws |
| Aliyun | 阿里云 | aliyun |
| Baidu Cloud | 百度云 | baidu_bce |
| Huawei Cloud | 华为云 | huawei |
| Microsoft Azure | 微软云 |  |
| QingCloud | 青云 | qingcloud |
| Tencent Cloud | 腾讯云 | tencent |

## 阿里公有云

- **录入步骤**
1. 进入「资源」-「资源池」-「云平台」
2. 点击“新建云平台”
3. 填写“云平台”相关信息，点击“确定”，得到一条云平台的记录

**TBD：此处有待插入图片**

- **配置项说明**

| 配置项 | 填写内容 | 备注 |
|-------|-----|--------|
| 云平台名称 | 例：aliyun-1	| 云平台的名称，可自定义 |
| AccessKey ID	 | 例：LTAI4FiU3ad3txLUSRg8xGfn	 | 请在阿里云控制台-accesskeys 页面上配置用于 API 访问的密钥 ID（只读权限即可） |
| AccessKey Secret	 | 例：itsHzkPo22jbtNZ61QEz3gc5bsPnXP	 | 请在阿里云控制台-accesskeys 页面上配置用于 API 访问的密钥 KEY（只读权限即可） |
| 区域白名单	 | 例：华南3（广州）, 华北6（乌兰察布）	 | 可以配置多个，不支持正则表达式；优先级高于区域黑名单；具体取值可参考阿里云 ECS 地域和可用区列表 |

> 注意：’区域白名单‘需填写且与实际的云服务器资源分布一致。如果’区域白名单‘为空（表示匹配全部区域）或过多，会产生 DeepFlow 查询过多的阿里云区域、同步周期长等情况。如果填写的区域未包含您的云服务器所在的区域，则会产生无法学习到该区域的云服务器信息，DeepFlow Agent 无法注册等情况。

- **API 说明**

DeepFlow 会使用如下 API 从阿里公有云对接学习资源信息，如果需要限制 DeepFlow 能够学习的资源项，可在阿里云控制台限制 AK/SK 的权限：

| API | 对接内容 | 是否必须项 |
|-------|-----|--------|
| DescribeRegions | 区域列表 | 必需项 | 
| DescribeVpcs | VPC列表 | 必需项 | 
| DescribeVSwitches | 虚拟交换机列表 | 必需项 | 
| DescribeInstances | 云服务器实例列表 | 必需项 | 
| DescribeNetworkInterfaces | 云服务器网络接口列表 | 必需项 | 
| DescribeNatGateways | NAT网关列表 | 非必需项 | 
| DescribeSnatTableEntries |    | 非必需项 | 
| DescribeForwardTableEntries |    | 非必需项 | 
| DescribeRouteTableList |    | 非必需项 | 
| DescribeRouteEntryList |    | 非必需项 |  
| DescribeSecurityGroups |    | 非必需项 | 
| DescribeSecurityGroupAttribute |    | 非必需项 | 
| DescribeLoadBalancers |    | 非必需项 | 
| DescribeLoadBalancerAttribute |    | 非必需项 | 
| DescribeHealthStatus |    | 非必需项 | 
