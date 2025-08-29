---
title: Path Search Box
permalink: /guide/ee-tenant/query/path-search/
---

> This document was translated by ChatGPT

# Path Search Box

The `Path Search Box` is used in Application - Path Analysis/Topology Analysis, Network - Path Analysis/Topology Analysis/NAT Tracing.

![00-Path Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065faac6eb6f17.png)

- **①/②/③/④/⑦**: For detailed operation instructions, please refer to [Resource Search Box](./service-search/)
- **⑤ Search Mode**: You can switch between `Simplified Mode`, `Unidirectional Path`, and `Bidirectional Path` modes. Combined with the `Path Filter` capability, you can query the required path data.
  - Simplified Search: The entered `search tags` will be used as conditions for both `client` and `server` queries. For details, please refer to the **Simplified Mode** section.
  - Unidirectional Path: The entered `search tags` will be used as conditions for either the corresponding `client` or `server`. For details, please refer to the **Unidirectional Path** section.
  - Bidirectional Path: The entered `search tags` do not specify a query direction. For details, please refer to the **Bidirectional Path** section.
- **⑥ Path Filter**: Supported only in `Simplified Search` mode. For details, please refer to the **Simplified Mode** section.

## Simplified Mode

![01-Simplified Mode](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab1ff0d41a.png)

The Path Search Box can switch between `Simplified Mode`, `Unidirectional Path`, and `Bidirectional Path` modes. Combined with the `Path Filter` capability, you can query the required path data.

- **①/②/③/④**: For detailed operation instructions, please refer to [Resource Search Box](./service-search/)
- **⑤ Search Mode**: Click to switch between `Simplified Search` and `Path Search` modes.
- **⑤ Path Filter**: Supports selecting the path to query and supports querying three types of paths. Only available in `Simplified Search` mode.
  - Intra-service Path: Paths between services or resources.
  - Inter-service Path: Paths between a service/resource and other services/resources.
  - WAN Path: Paths between a service/resource and the wide area network.

## Unidirectional Path

![02-Unidirectional Path](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab3eccc2de.png)

- **①/②/③/④**: For detailed operation instructions, please refer to [Resource Search Box](./service-search/)
- **⑤ Search Mode**: You can switch the search mode. For details, please refer to the **Path Search Box** section.
- **⑥ Swap Direction**: Click to quickly swap the search conditions of `client` and `server`. Only available in `Unidirectional Path` mode.

## Bidirectional Path

![03-Bidirectional Path](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab5961fd4e.png)

- **①/②/③/④**: For detailed operation instructions, please refer to [Resource Search Box](./service-search/)
- **⑤ Search Mode**: You can switch the search mode. For details, please refer to the **Path Search Box** section.

# Application Scenarios

## View the call topology of all services within a namespace

- Function Page: Application - Topology Analysis
- Data Table: Metrics (minute-level)

---

- Search Tag: pod_ns = gcp-microservices-demo
- Path: Intra-service
- Primary Group: auto_service
- Secondary Group: observation_point

![04-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b00145.png)

## View the application performance of all paths for a service

- Function Page: Application - Path Overview
- Data Table: Metrics (minute-level)

---

- Search Tag: pod_ns = gcp-microservices-demo, pod_service = productpageservice
- Path: Intra-service, Inter-service, WAN
- Primary Group: auto_service
- Secondary Group: observation_point

![05-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b659a4.png)

## View the application performance of a service accessing an external cloud MySQL

- Function Page: Application - Path Overview
- Data Table: Call Logs

---

- Direction: Client
- Search Tag: pod_service = finaxxx, l7_protocol = MySQL
- Primary Group: auto_service
- Secondary Group: observation_point

---

- Direction: Server
- Search Tag: ip = 8.x.x.x (address of the external cloud MySQL)
- Primary Group: auto_service
- Secondary Group: observation_point

![06-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8c96f16.png)

## View application performance at POD granularity for mutual access between two workloads

- Function Page: Application - Path Overview
- Data Table: Metrics (minute-level)

---

- Search Tag: pod_group = recommendationservice, pod_group = productcatalogservice
- Path: Intra-service
- Primary Group: auto_service
- Secondary Group: observation_point

![07-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8d313a2.png)

## View performance data for paths corresponding to a specific domain name

- Function Page: Application - Path Overview
- Data Table: Call Logs

---

- Search Tag: request_domain : hotels.travel-agency:8000
- Path: Intra-service, Inter-service, WAN
- Primary Group: auto_service
- Secondary Group: observation_point, request_domain

![08-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8de4a50.png)

## View the top 5 other resources accessing a specific cloud server by traffic

- Function Page: Network - Path Analysis
- Data Table: Metrics (minute-level)

---

- Direction: Client
- Search Tag: chost != cn-zhxxx
- Primary Group: auto_service
- Secondary Group: observation_point

---

- Direction: Server
- Search Tag: chost = cn-zhxxx
- Primary Group: chost
- Secondary Group: observation_point

![09-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8eb246e.png)

## View the top 5 WAN IPs by traffic for a specific service port on a cloud server

- Function Page: Network - Path Overview
- Data Table: Flow Logs

---

- Direction: Client
- Search Tag: is_internet = Yes
- Primary Group: auto_service
- Secondary Group: observation_point

---

- Direction: Server
- Search Tag: chost = cn-zhxx, server_port = 80
- Primary Group: chost
- Secondary Group: observation_point, server_port

![10-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8f9ac67.png)

## View the network performance of a client (POD) accessing a server (POD)

- Function Page: Network - Path Overview
- Data Table: Metrics (minute-level)

---

- Direction: Client
- Search Tag: pod = nginx-xxxx
- Primary Group: pod
- Secondary Group: observation_point

---

- Direction: Server
- Search Tag: pod = bohriu-xxxx
- Primary Group: pod
- Secondary Group: observation_point

![11-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f9054a2e.png)