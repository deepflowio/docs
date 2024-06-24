---
title: Network Services
permalink: /guide/ee-tenant/resources/network-services/
---

> This document was translated by ChatGPT

# Network Services

Network services display relevant data information of different components in the cloud computing network architecture, including security groups, NAT gateways, load balancers, peering connections, and cloud enterprise networks.

## Security Groups

Security groups are a virtual network security mechanism in cloud computing that controls the inbound and outbound traffic of cloud instances, thereby protecting the security of cloud instances and cloud networks.

![01-Security Groups](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448d05507924.png)

- All Security Group Rules: Supports viewing all security group rules, including direction, IP type, protocol type, local port range, remote port range, etc., and supports exporting CSV.
- Operations
  - View Security Group Rules: Supports viewing all rules of the clicked security group.
- For the usage of other buttons on the page, please refer to the section [Resource Pool - Region](./network-resources/).

## NAT Gateway

NAT gateways can achieve network address mapping between different subnets and enable communication between private network instances and the internet. The NAT gateway page supports viewing and downloading related information, such as external IP, region, VPC, number of gateway rules, cloud platform, etc., and also supports viewing and downloading gateway rule information.

- For the usage of buttons on the page, please refer to the section [Resource Pool - Region](./network-resources/).

## Load Balancer

Load balancers in cloud computing distribute traffic to multiple virtual machines by adjusting the traffic of virtual machines, thereby achieving load balancing and improving the availability and scalability of applications. The load balancer page supports viewing and downloading related information, such as IP, region, VPC, number of load balancers, cloud platform, etc., and also supports viewing and downloading rule information.

- For the usage of buttons on the page, please refer to the section [Resource Pool - Region](./network-resources/).

## Peering Connection

Peering connections are local network connection services that support the establishment of virtual private network interconnections between geographically different VPCs. The peering connection page allows viewing related information, such as local region, local VPC, remote region, remote VPC, cloud platform, etc., and supports creating new peering connections and exporting CSV.

- For the usage of buttons on the page, please refer to the section [Resource Pool - Region](./network-resources/).

## Cloud Enterprise Network

Cloud enterprise networks are a cloud computing solution that provides interconnection between private and public networks, and also enables network interconnection between multiple different cloud vendors, improving the security, stability, and reliability of data communication. The cloud enterprise network page supports viewing related information, such as associated instances, cloud platform, etc., and also supports exporting CSV.

- For the usage of buttons on the page, please refer to the section [Resource Pool - Region](./network-resources/).