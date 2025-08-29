---
title: Computing Resources
permalink: /guide/ee-tenant/resources/computing-resources/
---

> This document was translated by ChatGPT

# Computing Resources

The Computing Resources page allows you to view the physical or virtual devices used for processing and executing computing tasks. You can view information for cloud servers and host machines separately.

## Cloud Server

Cloud servers allow users to deploy and run various applications. The Cloud Server page displays related information.

![Cloud Server](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304256447a5dd95922.png)

- **① Action Buttons**:
  - Create Cloud Server: Create a new cloud server
  - Export CSV: Download the data
  - All NICs: Display all network interface card information in a list, including IP, MAC, name, subnet, associated cloud server, etc., and supports CSV export
- **② Refresh Cache**: Refresh the cache for faster data access
- **③ VPC**: Click to navigate to the page showing the VPC information of the corresponding cloud server. See the [Network Resources - VPC](./network-resources/) section
- **④ Collector Status**: View collector-related information for the cloud server, such as basic information, configuration, monitoring data, and operation logs
- **⑤ Edit**: Only supports name modification
- **⑥ NIC List**: View the NIC information under the current cloud server

## Host Machine

A host machine is a physical server running virtualization software on an operating system. On the Host Machine page, you can view related information such as region, availability zone, related IP information, CPU, memory, NICs, collectors, and more.