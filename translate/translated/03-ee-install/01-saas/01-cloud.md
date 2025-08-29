---
title: Registering Cloud Platforms in DeepFlow
permalink: /ee-install/saas/cloud
---

> This document was translated by ChatGPT

# Introduction

Registering a cloud platform in the DeepFlow web interface and completing the integration with the cloud platform API is a prerequisite for the following DeepFlow features to function:

- Learn public cloud server instance information to accept registration requests from DeepFlow Agents deployed inside cloud servers.
- Learn public cloud VPC, load balancer, RDS, and other resource and tag information, and automatically inject `cloud resource` tags into observability data collected by DeepFlow Agents.

This section provides a detailed guide on how to register cloud platform information in the DeepFlow web interface to complete API integration with the cloud platform.  
Once registered, DeepFlow will automatically synchronize cloud resource information periodically via the cloud platform’s API based on your configuration, and build observability data tags in DeepFlow.

# Interaction Topology

![Interaction Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407156694c77d6f050.jpeg)

# Supported Cloud Providers

DeepFlow currently supports API integration and cloud resource synchronization for the following public clouds:
| Cloud Provider (English) | Cloud Provider (Chinese) | Type Identifier in DeepFlow |
| ------------------------ | ------------------------ | --------------------------- |
| AWS                      | AWS                      | aws                         |
| Aliyun                   | 阿里云                   | aliyun                      |
| Baidu Cloud              | 百度云                   | baidu_bce                   |
| Huawei Cloud             | 华为云                   | huawei                      |
| Microsoft Azure          | 微软云                   |                             |
| QingCloud                | 青云                     | qingcloud                   |
| Tencent Cloud            | 腾讯云                   | tencent                     |
| Volcengine               | 火山引擎                 | volcengine                  |

# Aliyun

## Registration Steps

1. Go to `Resources` - `Resource Pool` - `Cloud Platform`
2. Click `New Cloud Platform`
3. Fill in the relevant cloud platform information and click `OK` to create a cloud platform record

![Register Cloud Platform (Aliyun)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a7076882c.png)

## Configuration Item Description

| Configuration Item  | Example Value                           | Notes                                                                 |
| ------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Cloud Platform Name | e.g., `my-aliyun`                        | The name of the cloud platform as displayed in DeepFlow, customizable |
| AccessKey ID        | e.g., `LTAI4FiU3ad3txLUSRg8xGfn`         | Create an AccessKey in the Aliyun console and enter the ID here       |
| AccessKey Secret    | e.g., `itsHzkPo22jbtNZ61QEz3gc5bsPnXP`   | Create an AccessKey in the Aliyun console and enter the Secret here   |
| Region Whitelist    | e.g., `华南3（广州）, 华北6（乌兰察布）` | List of regions where Aliyun ECS resources are located, separated by `, ` |

::: warning
`Region Whitelist` must be filled in and must match the actual distribution of your cloud server resources.  
If the `Region Whitelist` is empty (matches all regions) or contains too many regions, DeepFlow may query too many Aliyun regions, resulting in long query cycles.  
If the regions you enter do not include the regions where your cloud servers are located, DeepFlow will not be able to learn the cloud server information in those regions, and DeepFlow Agents will fail to register.
:::

**Steps to create an AccessKey in the Aliyun console**:

![Create AccessKey in Aliyun Console](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a59992c.png)

**Steps to check the regions where Aliyun resources are located**:

![Check Aliyun Resource Regions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a9687e6.png)

## API Permission Description

DeepFlow uses the following APIs to learn resource information from Aliyun.  
If you need to restrict the resources DeepFlow can access, you can limit the permissions of the account used to generate the AccessKey in the Aliyun console:

| Product     | API                           | Permission                | Integration Content              | Required |
| ----------- | ----------------------------- | ------------------------- | --------------------------------- | -------- |
| Vpc         | DescribeRegions               | AliyunVPCReadOnlyAccess   | Query region list                 | Yes      |
| Vpc         | DescribeVpcs                  | AliyunVPCReadOnlyAccess   | Query VPC list                    | Yes      |
| Vpc         | DescribeVSwitches             | AliyunVPCReadOnlyAccess   | Query switch list                 | Yes      |
| Ecs         | DescribeInstances             | AliyunECSReadOnlyAccess   | Query cloud server instance list  | Yes      |
| Ecs         | DescribeNetworkInterfaces     | AliyunECSReadOnlyAccess   | Query cloud server NIC list       | Yes      |
| Vpc         | DescribeNatGateways           | AliyunVPCReadOnlyAccess   | Query NAT gateway list            | No       |
| Vpc         | DescribeSnatTableEntries      | AliyunVPCReadOnlyAccess   | Query NAT gateway SNAT rules      | No       |
| Vpc         | DescribeForwardTableEntries   | AliyunVPCReadOnlyAccess   | Query NAT gateway DNAT rules      | No       |
| Slb         | DescribeLoadBalancers         | AliyunSLBReadOnlyAccess   | Query load balancers              | No       |
| Slb         | DescribeLoadBalancerAttribute | AliyunSLBReadOnlyAccess   | Query load balancer listeners     | No       |
| Slb         | DescribeHealthStatus          | AliyunSLBReadOnlyAccess   | Query load balancer rules         | No       |
| Container Service | DescribeClusters        | AliyunCSReadOnlyAccess    | Query cluster list                | No       |

# Tencent Cloud

## Registration Steps

1. Go to `Resources` - `Resource Pool` - `Cloud Platform`
2. Click `New Cloud Platform`
3. Fill in the relevant cloud platform information and click `OK` to create a cloud platform record

![Register Cloud Platform (Tencent Cloud)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a705b08bb.png)

## Configuration Item Description

| Configuration Item  | Example Value                         | Notes                                                                                                      |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Cloud Platform Name | e.g., tencent-1                        | The name of the cloud platform as displayed in DeepFlow, customizable                                      |
| AccessKey ID        | e.g., AKIDztZ0C9dHuIQJwKMeZEixykjTBhz2L | Enter the `SecretId` generated after creating a new key in Tencent Cloud `Access Management` - `API Key Management` (read-only permission is sufficient) |
| AccessKey Secret    | e.g., itsHzkPo22jbtNZ61QEz3gc5bsPnXP    | Enter the `SecretKey` corresponding to the `SecretId` (read-only permission is sufficient)                 |
| Region Whitelist    | e.g., 华东地区(上海)                    | List of regions where Tencent Cloud servers are located, multiple regions can be configured, regex not supported, separated by `, ` |

::: warning
`Region Whitelist` must be filled in and must match the actual distribution of your cloud server resources.  
If the `Region Whitelist` is empty (matches all regions) or contains too many regions, DeepFlow may query too many Tencent Cloud regions, resulting in long query cycles.  
If the regions you enter do not include the regions where your cloud servers are located, DeepFlow will not be able to learn the cloud server information in those regions, and DeepFlow Agents will fail to register.
:::
::: tip
Tencent Cloud `Region` list includes: 华南地区(广州), 华东地区(南京), 华北地区(北京), 西南地区(成都), 西南地区(重庆), 港澳台地区(中国香港), 亚太东北(首尔), 亚太东北(东京), 亚太东南(新加坡), 亚太东南(曼谷), 亚太东南(雅加达), 美国西部(硅谷), 欧洲地区(法兰克福), 亚太南部(孟买), 美国东部(弗吉尼亚), 南美地区(圣保罗), 北美地区(多伦多)
:::

**Steps to create a key in the Tencent Cloud console**:

![Create Key in Tencent Cloud Console](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240719669a41be51191.png)

## API Permission Description

DeepFlow uses the following APIs to learn resource information from Tencent Cloud.  
If you need to restrict the resources DeepFlow can access, you can limit the permissions of the account used to generate the key in the Tencent Cloud console:

| API                                                    | Integration Content                  | Required |
| ------------------------------------------------------ | ------------------------------------- | -------- |
| DescribeRegions                                        | Query region list                     | Yes      |
| DescribeZones                                          | Query availability zone list          | Yes      |
| DescribeVpcs                                           | Query VPC list                        | Yes      |
| DescribeNatGateways                                    | Query NAT gateways and related info   | Yes      |
| DescribeNatGatewayDestinationIpPortTranslationNatRules | Query NAT gateway rules               | Yes      |
| DescribeRouteTables                                    | Query route tables                    | Yes      |
| DescribeSubnets                                        | Query subnet list                     | Yes      |
| DescribeInstances                                      | Query instance list                   | Yes      |
| DescribeNetworkInterfaces                              | Query elastic NIC list                 | Yes      |
| DescribeLoadBalancers                                  | Query load balancer list              | Yes      |
| DescribeListeners                                      | Query load balancer listener list     | Yes      |
| DescribeTargets                                        | Query backend service list bound to load balancers | Yes      |
| DescribeClassicalLBListeners                           | Query classic load balancer listener list | Yes   |