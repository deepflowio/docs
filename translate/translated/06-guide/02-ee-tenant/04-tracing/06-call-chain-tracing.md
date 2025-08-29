---
title: Distributed Tracing
permalink: /guide/ee-tenant/tracing/call-chain-tracing/
---

> This document was translated by ChatGPT

# Distributed Tracing

Distributed tracing records detailed information for each call, and only supports traces initiated from data collected via eBPF or transmitted to DeepFlow through the OpenTelemetry protocol.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566442db5b7387.png)

- **① Time Selector**: Supports time-based filtering queries. For details, please refer to [Dashboard Details - Time Selector](../dashboard/use/).
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to [Query - Search Snapshot](../query/history/).
- **③ Search Save and Settings**:
  - Save Search: Supports quickly saving the current page's search conditions. For details, please refer to [Query - Search Snapshot](../query/history/).
  - Settings: A collection of page setting operations.
    - Database Fields: Supports viewing tags and metrics from the data table used on the current page.
    - Name Full/Abbreviated Display: Choose to display legend names in full or abbreviated form.
- **④ Service Search Box**: Supports searching or grouping by Tag. For details, please refer to [Query](../query/overview/).
- **⑤ Left Quick Filter**: Allows quick data filtering. For details, please refer to [Query - Left Quick Filter](../query/left-quick-filter/).
- **⑥ Region Query**: Supports quickly switching the query region data.
- **Application Tracing Table**: Displays call information between services or resources within a certain time range, such as client, server, requested resource, request type, request domain name, etc. For details, please refer to [Table](../dashboard/panel/table/).
  - **Action:** Click a table row to open the right sliding panel and view the entire call lifecycle traced from that request. For details, please refer to [Right Sliding Panel - Distributed Tracing](./right-sliding-box/).