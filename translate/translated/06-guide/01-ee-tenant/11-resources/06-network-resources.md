---
title: Network Resources
permalink: /guide/ee-tenant/resources/network-resources/
---

> This document was translated by ChatGPT

# Network Resources

The Network Resources page allows you to view information related to resources in the current network architecture, including VPCs, subnets, routers, DHCP gateways, and IP addresses. Each network resource has different functions and roles and can be used to build a complete network architecture.

## VPC

A VPC is a virtual network environment. On the VPC page, you can view relevant data information in the virtual environment.

![01-VPC](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448916ab2058.png)

- For the usage of page buttons, please refer to the section [Resource Pool - Region](./network-resources/).

## Subnet

A subnet is a logical partition within a VPC that corresponds to an actual network address segment. Instances within a subnet can connect to other subnets or the public network through the VPC's router.

![02-子网](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448943337299.png)

- For the usage of page buttons, please refer to the section [Resource Pool - Region](./network-resources/).

## Router

A router is responsible for transmitting requests from one network to another. On the Router page, you can view information about all routers.

![03-路由器](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023042664489e7cde5f0.png)

- All Routing Rules: Supports viewing all routing tables, which contain tables with paths to specific addresses, including destination IP, next hop type, next hop, and the router it belongs to.
- Operations
  - View Routing Rules: You can view the routing table of the current router.
- For the usage of other page buttons, please refer to the section [Resource Pool - Region](./network-resources/).

## DHCP Gateway

The DHCP gateway supports automatic IP address allocation. On the DHCP Gateway page, you can view information about all DHCP gateways, such as region, VPC, IP, cloud platform, deletion time, etc.

## IP Address

An IP address is a numerical address used to identify devices in a network.

![04-IP地址](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448be4281264.png)

- For the usage of other page buttons, please refer to the section [Resource Pool - Region](./network-resources/).