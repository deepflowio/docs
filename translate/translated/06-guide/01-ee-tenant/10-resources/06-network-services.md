---
title: Network Services
permalink: /guide/ee-tenant/resources/network-services/
---

> This document was translated by GPT-4

# Network Services

Network Services display relevant data information of different components in the cloud computing network architecture, including security groups, NAT gateways, load balancers, peering connections, and cloud networks.

## Security Group

Security Group is a virtual network security mechanism in cloud computing that controls the ingress and egress traffic of cloud instances, thus protecting the safety of cloud instances and cloud networks.

![06-network_services.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448d05507924.png)

- All security group rules: supports viewing all security group rules, which include directions, IP types, protocol types, local port range, remote port range, etc. It also supports exporting as CSV file.
- Operations
  - View security group rules: supports viewing all rules of the clicked security group
- For the use of other buttons on the page, please refer to the [Resource Pool - Region](./network-resources/) chapter description.

## NAT Gateway

NAT Gateways can realize the mapping of network addresses between different subnets and enable communication between private network instances and the Internet. The NAT Gateway page supports viewing and downloading related information such as public IPs, regions, VPCs, gateway rule counts, cloud platforms, and also supports viewing and downloading gateway rule information.

- For page button usage, please refer to the [Resource Pool - Region](./network-resources/) chapter description.

## Load Balancer

In cloud computing, Load Balancers distribute traffic to multiple virtual machines by adjusting the traffic of virtual machines, thereby achieving balanced load and improving the availability and scalability of applications. The Load Balancer page supports viewing and downloading related information like IPs, regions, VPCs, load balancer counts, cloud platforms, etc., and also supports viewing and downloading rule information.

- For page button usage, please refer to the [Resource Pool - Region](./network-resources/) chapter description.

## Peering Connection

Peering Connection offers local network connection services and supports establishing a Virtual Private Network (VPN) interconnection between geographically different VPCs. The Peering Connection page allows viewing related information like local region, local VPC, remote region, remote VPC, cloud platforms, etc., and supports creating a new connection and exporting as a CSV file.

- For page button usage, please refer to the [Resource Pool - Region](./network-resources/) chapter description.

## Cloud Network

The Cloud Network is a cloud computing solution that provides interconnection between private and public networks and can also enable network interconnection between different cloud vendors, enhancing the security, stability, and reliability of data communication. The Cloud Network page supports viewing related information as associated instances, cloud platforms, etc., and also supports exporting as CSV.

- For page button usage, please refer to the [Resource Pool - Region](./network-resources/) chapter description.
