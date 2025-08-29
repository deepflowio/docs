---
title: Network Resources
permalink: /guide/ee-tenant/resources/network-resources/
---

> This document was translated by ChatGPT

# Network Resources

The Network Resources page allows you to view information about resources in the current network architecture, including VPCs, subnets, routers, DHCP gateways, and IP addresses. Each network resource has different functions and purposes, and can be used to build a complete network architecture.

## VPC

A VPC is a virtual network environment. On the VPC page, you can view relevant data information within the virtual environment.

![01-VPC](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448916ab2058.png)

- For the usage of page buttons, refer to the section **[Resource Pool - Region](./network-resources/)**

## Subnet

A subnet is a logical partition within a VPC, corresponding to an actual network address range. Instances within a subnet can connect to other subnets or the public network through the VPC's router.

![02-Subnet](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448943337299.png)

- For the usage of page buttons, refer to the section **[Resource Pool - Region](./network-resources/)**

## Router

A router is responsible for transmitting requests from one network to another. On the Router page, you can view information about all routers.

![03-Router](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023042664489e7cde5f0.png)

- All Routing Rules: Allows you to view all routing tables, which are tables containing address paths pointing to specific destinations, including destination IP, next hop type, next hop, and associated router.
- Actions  
  - View Routing Rules: View the routing table of the current router.
- For other page button usage, refer to the section **[Resource Pool - Region](./network-resources/)**

## DHCP Gateway

A DHCP gateway supports automatic IP address allocation. On the DHCP Gateway page, you can view information about all DHCP gateways, such as region, VPC, IP, cloud platform, deletion time, etc.

## IP Address

An IP address is a numerical address used to identify each device in a network.

![04-IP Address](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448be4281264.png)

- For other page button usage, refer to the section **[Resource Pool - Region](./network-resources/)**