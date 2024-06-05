---
title: Distributed Tracing
permalink: /guide/ee-tenant/application/call-chain-tracing/
---

> This document was translated by ChatGPT

# Distributed Tracing

Distributed tracing records detailed information for each call, supporting only data collected via eBPF or calls transmitted to DeepFlow through the OpenTelemetry protocol.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566442db5b7387.png)

- **① Time Selector**: Supports time filter queries. For details, please refer to the chapter [Dashboard Details - Time Selector](../dashboard/use/)
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the search conditions of the current page. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing tags and metrics in the data table used on the current page
    - Name Default/Full Display: Full or default display of legend names
- **④ Service Search Box**: Supports searching or grouping by Tag. For details, please refer to the chapter [Query](../query/overview/)
- **⑤ Left Quick Filter**: Allows quick data filtering. For details, please refer to the chapter [Query - Left Quick Filter](../query/left-quick-filter/)
- **⑥ Area Query**: Supports quick switching of query area data
- **Application Tracing Table**: Displays call information between services or resources within a certain period, such as client, server, request resource, request type, request domain, etc. For details, please refer to the chapter [Table](../dashboard/panel/table/)
  - **Operation:** Click on a list row to enter the right sliding box to view the entire call lifecycle traced from that request. For details, please refer to the chapter [Right Sliding Box - Distributed Tracing](./right-sliding-box/)
