---
title: Network Services
permalink: /guide/ee-tenant/resources/network-services/
---

> This document was translated by ChatGPT

# Network Services

Network services display relevant data information of different components in the cloud computing network architecture, including security groups, NAT gateways, load balancers, peering connections, and cloud enterprise networks.

## Security Groups

Security groups are a virtual network security mechanism in cloud computing that controls the ingress and egress traffic of cloud instances, thereby protecting the security of cloud instances and cloud networks.

![01-Security Groups](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448d05507924.png)

- All Security Group Rules: Supports viewing all security group rules, including direction, IP type, protocol type, local port range, remote port range, etc., and also supports exporting to CSV.
- Operations
  - View Security Group Rules: Supports viewing all rules of the clicked security group.
- For the usage of other buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section description.

## NAT Gateway

NAT Gateway can achieve network address mapping between different subnets and enable communication between private network instances and the internet. The NAT Gateway page supports viewing and downloading related information, such as external IP, region, VPC, number of gateway rules, cloud platform, etc., and also supports viewing and downloading gateway rule information.

- For the usage of buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section description.

## Load Balancer

In cloud computing, load balancers distribute traffic to multiple virtual machines by adjusting the traffic of virtual machines, thereby achieving load balancing and improving the availability and scalability of applications. The Load Balancer page supports viewing and downloading related information, such as IP, region, VPC, number of load balancers, cloud platform, etc., and also supports viewing and downloading rule information.

- For the usage of buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section description.

## Peering Connection

Peering connection is a local network connection service that supports establishing virtual private network interconnections between geographically different VPCs. The Peering Connection page allows viewing related information, such as local region, local VPC, remote region, remote VPC, cloud platform, etc., and supports creating new peering connections and exporting to CSV.

- For the usage of buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section description.

## Cloud Enterprise Network

Cloud Enterprise Network is a cloud computing solution that provides interconnection between private and public networks, and also enables network interconnection between multiple different cloud vendors, improving the security, stability, and reliability of data communication. The Cloud Enterprise Network page supports viewing related information, such as associated instances, cloud platform, etc., and also supports exporting to CSV.

- For the usage of buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section description.
