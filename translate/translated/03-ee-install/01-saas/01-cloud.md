---
title: Registering Cloud Platforms in DeepFlow
permalink: /ee-install/saas/cloud
---

> This document was translated by ChatGPT

# Introduction

Registering cloud platforms on the DeepFlow web page and completing the integration with cloud platform APIs are prerequisites for the following DeepFlow functionalities:

- Learning information about cloud server instances in public clouds to accept registration requests from DeepFlow Agents deployed within these cloud servers.
- Learning information about resources and tags such as VPCs, load balancers, and RDS in public clouds, and automatically injecting `cloud resource` tags into observability data collected by DeepFlow Agents.

This chapter will provide a detailed guide on how to register cloud platform information on the DeepFlow web page to complete the integration with cloud platform APIs.
Once registered, DeepFlow will automatically synchronize cloud resource information periodically through the APIs provided by the cloud platforms based on your configuration and build observability data tags for DeepFlow.

# Interaction Topology

![Interaction Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407156694c77d6f050.jpeg)

# Supported Cloud Service Providers

DeepFlow currently supports API integration and cloud resource information synchronization with the following public clouds:
| Cloud Service Provider (English) | Cloud Service Provider (Chinese) | Type Identifier in DeepFlow |
| -------------------------------- | -------------------------------- | --------------------------- |
| AWS                              | AWS                              | aws                         |
| Aliyun                           | 阿里云                           | aliyun                      |
| Baidu Cloud                      | 百度云                           | baidu_bce                   |
| Huawei Cloud                     | 华为云                           | huawei                      |
| Microsoft Azure                  | 微软云                           |                             |
| QingCloud                        | 青云                             | qingcloud                   |
| Tencent Cloud                    | 腾讯云                           | tencent                     |
| Volcengine                       | 火山引擎                         | volcengine                  |

# Aliyun

## Registration Steps

1. Go to `Resources` - `Resource Pool` - `Cloud Platform`
2. Click `New Cloud Platform`
3. Fill in the relevant cloud platform information and click `Confirm` to get a record of the cloud platform

![Register Cloud Platform (Aliyun)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a7076882c.png)

## Configuration Item Description

| Configuration Item | Content Example                        | Remarks                                                                 |
| ------------------ | -------------------------------------- | ----------------------------------------------------------------------- |
| Cloud Platform Name| Example: `my-aliyun`                   | The name of the cloud platform as seen in DeepFlow, customizable         |
| AccessKey ID       | Example: `LTAI4FiU3ad3txLUSRg8xGfn`    | Create an AccessKey in the Aliyun console and fill in the ID here        |
| AccessKey Secret   | Example: `itsHzkPo22jbtNZ61QEz3gc5bsPnXP` | Create an AccessKey in the Aliyun console and fill in the Secret here    |
| Region Whitelist   | Example: `South China 3 (Guangzhou), North China 6 (Ulanqab)` | List of regions where Aliyun ECS resources are located, separated by `, ` |

::: warning
The `Region Whitelist` must be filled in and must match the actual distribution of cloud server resources. If the `Region Whitelist` is empty (matching all regions) or too extensive, DeepFlow may query too many Aliyun regions, resulting in long query cycles. If the regions listed do not include the regions where your cloud servers are located, DeepFlow will not be able to learn the information of the cloud servers in those regions, and DeepFlow Agents will not be able to register.
:::

**Steps to Create an AccessKey in the Aliyun Console**:

![Create AccessKey in Aliyun Console](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a59992c.png)

**Steps to Query the Regions of Aliyun Resources**:

![Query Regions of Aliyun Resources](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a9687e6.png)

## API Permission Description

DeepFlow will use the following APIs to learn resource information from Aliyun. If you need to restrict the resources that DeepFlow can learn, you can limit the resource permissions of the account used to generate the AccessKey in the Aliyun console:

| API                           | Integration Content         | Required |
| ----------------------------- | --------------------------- | -------- |
| DescribeRegions               | Query region list           | Required |
| DescribeVpcs                  | Query VPC list              | Required |
| DescribeVSwitches             | Query switch list           | Required |
| DescribeInstances             | Query cloud server instance list | Required |
| DescribeNetworkInterfaces     | Query cloud server network interface list | Required |
| DescribeNatGateways           | Query NAT gateway list      | Optional |
| DescribeSnatTableEntries      | Query NAT gateway SNAT rules | Optional |
| DescribeForwardTableEntries   | Query NAT gateway DNAT rules | Optional |
| DescribeLoadBalancers         | Query load balancers        | Optional |
| DescribeLoadBalancerAttribute | Query load balancer listeners | Optional |
| DescribeHealthStatus          | Query load balancer rules   | Optional |

# Tencent Cloud

## Registration Steps

1. Go to `Resources` - `Resource Pool` - `Cloud Platform`
2. Click `New Cloud Platform`
3. Fill in the relevant cloud platform information and click `Confirm` to get a record of the cloud platform

![Register Cloud Platform (Tencent Cloud)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a705b08bb.png)

## Configuration Item Description

| Configuration Item | Content Example                        | Remarks                                                                 |
| ------------------ | -------------------------------------- | ----------------------------------------------------------------------- |
| Cloud Platform Name| Example: tencent-1                     | The name of the cloud platform as seen in DeepFlow, customizable         |
| AccessKey ID       | Example: AKIDztZ0C9dHuIQJwKMeZEixykjTBhz2L | Fill in the `SecretId` generated after creating a new key in the `API Key Management` page under `Access Management` in the Tencent Cloud console (read-only permissions are sufficient) |
| AccessKey Secret   | Example: itsHzkPo22jbtNZ61QEz3gc5bsPnXP | Fill in the `SecretKey` corresponding to the `SecretId` (read-only permissions are sufficient) |
| Region Whitelist   | Example: East China (Shanghai)         | List of regions where Tencent Cloud servers are located, multiple regions can be configured, regular expressions are not supported, regions are separated by `, ` |

::: warning
The `Region Whitelist` must be filled in and must match the actual distribution of cloud server resources. If the `Region Whitelist` is empty (matching all regions) or too extensive, DeepFlow may query too many Tencent Cloud regions, resulting in long query cycles. If the regions listed do not include the regions where your cloud servers are located, DeepFlow will not be able to learn the information of the cloud servers in those regions, and DeepFlow Agents will not be able to register.
:::
::: tip
The Tencent Cloud `Region` list includes: South China (Guangzhou), East China (Nanjing), North China (Beijing), Southwest China (Chengdu), Southwest China (Chongqing), Hong Kong, Macao, and Taiwan (Hong Kong, China), Northeast Asia (Seoul), Northeast Asia (Tokyo), Southeast Asia (Singapore), Southeast Asia (Bangkok), Southeast Asia (Jakarta), Western US (Silicon Valley), Europe (Frankfurt), South Asia (Mumbai), Eastern US (Virginia), South America (São Paulo), North America (Toronto)
:::

**Steps to Create a Key in the Tencent Cloud Console**:

![Create Key in Tencent Cloud Console](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240719669a41be51191.png)

## API Permission Description

DeepFlow will use the following APIs to learn resource information from Tencent Cloud. If you need to restrict the resources that DeepFlow can learn, you can limit the resource permissions of the account used to generate the key in the Tencent Cloud console:

| API                                                    | Integration Content             | Required |
| ------------------------------------------------------ | ------------------------------- | -------- |
| DescribeRegions                                        | Query region list               | Required |
| DescribeZones                                          | Query availability zone list    | Required |
| DescribeVpcs                                           | Query VPC list                  | Required |
| DescribeNatGateways                                    | Query NAT gateways and related information | Required |
| DescribeNatGatewayDestinationIpPortTranslationNatRules | Query NAT gateway rules         | Required |
| DescribeRouteTables                                    | Query route tables              | Required |
| DescribeSubnets                                        | Query subnet list               | Required |
| DescribeInstances                                      | Query instance list             | Required |
| DescribeNetworkInterfaces                              | Query elastic network interface list | Required |
| DescribeLoadBalancers                                  | Query load balancer list        | Required |
| DescribeListeners                                      | Query load balancer listener list | Required |
| DescribeTargets                                        | Query backend services bound to load balancers | Required |
| DescribeClassicalLBListeners                           | Query classical load balancer listener list | Required |