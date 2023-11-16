---
title: Distributed Tracing
permalink: /guide/ee-tenant/application/call-chain-tracing/
---

> This document was translated by GPT-4

# Distributed Tracing

Distributed tracing records detailed information about each call, and only supports the data users collected via eBPF or the tracking initiated by DeepFlow transmitted through the OpenTelemetry protocol.

## Overview

![6_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aa718393da.png)

- **① Time Selector**: Supports time-filtered queries. For more details, please refer to the section 【[Visualization Details - Time Selector](../dashboard/use/)】
- **② Search Snapshot**: Supports saving search criteria as a snapshot. For more details, please refer to the section 【[Query - Search Snapshot](../query/history/)】
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the current page's search criteria. For more details, please refer to the section 【[Query - Search Snapshot](../query/history/)】
  - Settings: A collection of page setting operations.
    - Database field: Supports viewing the tag and metrics in the data table currently used on this page.
    - Full/Default Name Display: Provides options for either displaying the entire name or the default name of the legend.
- **④ Service Search Box**: Supports searching or grouping by Tag. For more details, please refer to the section 【[Query](../query/overview/)】
- **⑤ Left Quick Filter**: Allows quick filtering of data. For more details, please refer to the section 【[Query - Left Quick Filter](../query/left-quick-filter/)】
- **⑥ Area Query**: Supports quickly switching query region data.
- **Application Tracing Table**: Displays the call information between services or resources over a certain period of time, such as client, server, request resources, request type, request domain, etc. For more details, please refer to the section 【[Table](../dashboard/panel/table/)】
  - **Operation:** By clicking the `tracing` button, you can enter the right slide box to view the entire lifecycle of the call traced by this request. For more details, please refer to the section 【[Right Slide Box - Distributed Tracing](./right-sliding-box/)】.
