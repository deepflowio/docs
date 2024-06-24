---
title: Computing Resources
permalink: /guide/ee-tenant/resources/computing-resources/
---

> This document was translated by ChatGPT

# Computing Resources

The Computing Resources page allows you to view physical or virtual devices used for processing and executing computing tasks. You can separately view information on cloud servers and host machines.

## Cloud Servers

Cloud servers support users in deploying and running various applications. The Cloud Servers page provides relevant information.

![Cloud Servers](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304256447a5dd95922.png)

- **① Action Buttons**:
  - Create Cloud Server: Supports creating a new cloud server
  - Export CSV: Supports downloading data
  - All Network Cards: Displays all network card-related information in a list, including IP, MAC, name, subnet, associated cloud server, etc., and supports exporting CSV
- **② Refresh Cache**: Refreshes the cache for quick data access
- **③ VPC**: Click to navigate to the page to view the VPC information of the corresponding cloud server. Please refer to the section [Network Resources-VPC](./network-resources/)
- **④ Collector Status**: Supports viewing collector-related information of the cloud server, such as basic information, configuration information, monitoring information, running logs, etc.
- **⑤ Edit**: Only supports name modification
- **⑥ Network Card List**: Supports viewing network card information under the current cloud server

## Host Machines

Host machines are physical servers running virtualization software on the operating system. The Host Machines page provides relevant information such as region, availability zone, related IP information, CPU, memory, network cards, collectors, etc.