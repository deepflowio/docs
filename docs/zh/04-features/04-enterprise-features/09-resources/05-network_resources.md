---
title: 网络资源
---

# 网络资源

网络资源页面中支持查看当前网络架构中相关的资源信息，包含 VPC、子网、路由器、DHCP网关、IP地址，每个网络资源都有不同的功能和作用，可以被用于构建一个完整的网络架构

## VPC

VPC 是一种虚拟的网络环境，在 VPC 页面中可查看虚拟环境下的相关数据信息。

![05-network_resource.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448916ab2058.png)

- 页面按钮使用，可参考[资源池-区域](./05-network_resources.md)章节描述

## 子网

子网作为 VPC 内部的一个逻辑分区，它对应着一个实际的网络地址段。子网内的实例可以通过 VPC 的路由器连接到其他子网或者公网上。

![05-network_resource_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448943337299.png)

- 页面按钮使用，可参考[资源池-区域](./05-network_resources.md)章节描述

## 路由器

路由器负责将请求从一个网络传送到另一个网络。路由器页面中可查看所有路由器的信息。

![05-network_resource_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023042664489e7cde5f0.png)

- 全部路由规则：支持查看所有的路由表，即存有指向特定指向的地址路径的表格，包含目的地址IP、下一跳类型、下一跳、所属路由器
- 操作
  - 查看路由规则：可查看当前路由器的路由表
- 页面其他按钮使用，可参考[资源池-区域](./05-network_resources.md)章节描述

## DHCP网关

DHCP 网关支持自动分配 IP 地址，DHCP 网关页面中可查看所有DHCP网关的信息，如区域、VPC、IP、云平台、删除时间等。

## IP地址

IP 地址是用于标识网络中各个设备的数字地址。

![05-network_resource_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448be4281264.png)

- 页面其他按钮使用，可参考[资源池-区域](./05-network_resources.md)章节描述