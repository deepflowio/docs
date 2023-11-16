---
title: Path Search Box
permalink: /guide/ee-tenant/query/path-search/
---

> This document was translated by GPT-4

# Path Search Box

The path search box is used in Application-Path Statistics/Path Topology and Network-Network Path/Network Topology/NAT Tracing.

![1-Path Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f883b6cf.png)

![2-Path Search](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f891b970.png)

![3-Path Filter](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8a31f4c.png)

The path search box can switch between 'Simplified Search' and 'Path Search' modes. Combined with 'Path Filter' capabilities, it queries the data of the needed paths.

- **①/②/③/⑥**：For the detailed operation and usage instructions, you can refer to the [Service Search Box](./service-search/)
- **④ Edit Externally-related Filtering Conditions**:
  The option lets you edit the 'External Service Collection', which is hidden by default
- **④ Switch between Simplified Search/Path Search**:
  Pressing this option lets you toggle between 'Simplified Search' and 'Path Search'
  - Simplified Search: Filters the Tag data entered in 'Search Condition Input Box' as 'Client side' or 'Server side'
  - Path Search: Shows paths defined from ‘Client side’ and ‘Server side’, and apply filters data based on the specified direction.
- **⑤ Path Filtering**:
  In 'Simplified Search' mode, it enables you to edit path filtering conditions. The DeepFlow platform defines three types of paths:
  - Internal Service Paths: paths between services or resources filtered via the 'Search Condition Input Box'
  - External Service Paths: paths between the filtered services or resources in 'Search Condition Input Box' and other services or resources
  - WAN Paths: paths between the filtered services or resources in 'Search Condition Input Box' and the WAN
- **⑦/⑧ Path direction**:
  Direction of 'Path Search' mode
- **⑨ Swap Direction**:
  Click to quickly switch between 'Client side' and 'Server side'

# Use Cases

## View the invocation topology of all services within a specific namespace

- Function Page: Application-Path Topology
- Data Table: Metrics (per minute)

---

- Search Tags: pod_ns = gcp-microservices-demo
- Path: Internal Service
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

![4-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b00145.png)

## View the application performance of all paths for a specific service

- Function Page: Application-Path Overview
- Data Table: Metrics (per minute)

---

- Search Tags: pod_ns = gcp-microservices-demo, pod_service = productpageservice
- Path: Internal Service, External Service, WAN
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

![5-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b659a4.png)

## View the application performance of a service accessing an extern MySQL

- Function Page: Application-Path Overview
- Data Table: Invocation Logs

---

- Direction: Client Side
- Search Tags: pod_service = finaxxx, l7_protocol = MySQL
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

---

- Direction: Server Side
- Search Tags: ip = 8.x.x.x (extern MySQL address)
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

![6-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8c96f16.png)

## View the application performance of two workloads interacting at the POD granularity

- Function Page: Application-Path Overview
- Data Table: Metrics (per minute)

---

- Search Tags: pod_group = recommendationservice, pod_group = productcatalogservice
- Path: Internal Service
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

![7-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8d313a2.png)

## View the performance data of a path corresponding to a domain

- Function Page: Application-Path Overview
- Data Table: Invocation Logs

---

- Search Tags: request_domain : hotels.travel-agency:8000
- Path: Internal Service, External Service, WAN
- Primary Grouping: auto_service
- Secondary Grouping: tap_side, request_domain

![8-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8de4a50.png)

## View the TOP 5 of the other resources accessing a specific cloud server

- Function Page: Network-Network Path
- Data Table: Metrics (per minute)

---

- Direction: Client Side
- Search Tags: chost != cn-zhxxx
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

---

- Direction: Server Side
- Search Tags: chost = cn-zhxxx
- Primary Grouping: chost
- Secondary Grouping: tap_side

![9-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8eb246e.png)

## View the TOP 5 public IP addresses accessing a service port of a cloud server

- Function Page: Network-Path Overview
- Data Table: Stream Logs

---

- Direction: Client Side
- Search Tags: is_internet = true
- Primary Grouping: auto_service
- Secondary Grouping: tap_side

---

- Direction: Server Side
- Search Tags: chost = cn-zhxxx, server_port = 80
- Primary Grouping: chost
- Secondary Grouping: tap_side, server_port

![10-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8f9ac67.png)

## View the network performance of a client-side POD accessing a server-side POD

- Function Page: Network-Path Overview
- Data Table: Metrics (per minute)

---

- Direction: Client Side
- Search Tags: pod = nginx-xxxx
- Primary Grouping: pod
- Secondary Grouping: tap_side

---

- Direction: Server Side
- Search Tags: pod = bohriu-xxxx
- Primary Grouping: pod
- Secondary Grouping: tap_side

![11-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f9054a2e.png)
