---
title: Computing Resources
permalink: /guide/ee-tenant/resources/computing-resources/
---

> This document was translated by ChatGPT

# Computing Resources

The Computing Resources page allows you to view physical or virtual devices used for processing and executing computing tasks. You can view information on cloud servers and host machines separately.

## Cloud Servers

Cloud servers support users in deploying and running various applications. The Cloud Servers page provides relevant information.

![Cloud Servers](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304256447a5dd95922.png)

- **① Action Buttons**:
  - Create Cloud Server: Allows the creation of new cloud servers
  - Export CSV: Allows downloading of data
  - All Network Cards: Displays all network card information in a list, including IP, MAC, name, subnet, associated cloud server, etc., and supports CSV export
- **② Refresh Cache**: Refreshes the cache for quick data access
- **③ VPC**: Clicking this redirects to a page displaying the VPC information of the corresponding cloud server. Please refer to the [Network Resources - VPC](./network-resources/) section for details
- **④ Collector Status**: Allows viewing of collector-related information for the cloud server, such as basic information, configuration, monitoring information, and operation logs
- **⑤ Edit**: Only supports name modification
- **⑥ Network Card List**: Allows viewing of network card information under the current cloud server

## Host Machines

Host machines are physical servers running virtualization software on an operating system. The Host Machines page provides relevant information such as region, availability zone, related IP information, CPU, memory, network cards, collectors, etc.
