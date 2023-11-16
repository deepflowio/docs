---
title: Network Resources
permalink: /guide/ee-tenant/resources/network-resources/
---

> This document was translated by GPT-4

# Network Resources

The network resources page supports viewing relevant resource information in the current network architecture, including VPCs, subnets, routers, DHCP gateways, and IP addresses. Each network resource has different functions and roles and can be used to construct a complete network architecture.

## VPC

VPC is a virtual network environment. The VPC page allows you to view the related data information in the virtual environment.

![05-network_resource.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448916ab2058.png)

- For the usage of the page buttons, please refer to the section [Resource Pool-Region](./network-resources/).

## Subnet

As a logical partition within the VPC, the subnet corresponds to an actual network address segment. Instances within the subnet can be connected to other subnets or the public network through the VPC's router.

![05-network_resource_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448943337299.png)

- For the usage of the page buttons, please refer to the section [Resource Pool-Region](./network-resources/).

## Router

Routers are responsible for transmitting requests from one network to another. The router page allows you to view the information of all routers.

![05-network_resource_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023042664489e7cde5f0.png)

- All router rules: Support viewing all routing tables, i.e. tables storing paths to specific destinations, which include destination IP address, next hop type, next hop, and the corresponding router.
- Operations:
  - View routing rules: Allows you view the routing table of the current router.
- For the usage of other page buttons, please refer to the section [Resource Pool-Region](./network-resources/).

## DHCP Gateway

The DHCP gateway supports automatic IP address allocation. The DHCP Gateway page allows you to view all DHCP Gateway's information such as region, VPC, IP, cloud platform, deletion time, etc.

## IP Address

IP address is a numeric address used to identify devices in the network.

![05-network_resource_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448be4281264.png)

- For the usage of the other page buttons, please refer to the section [Resource Pool-Region](./network-resources/).
