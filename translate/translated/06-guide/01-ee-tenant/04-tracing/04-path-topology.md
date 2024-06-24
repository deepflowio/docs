---
title: Topology Analysis
permalink: /guide/ee-tenant/tracing/path-topology/
---

> This document was translated by ChatGPT

# Topology Analysis

The topology analysis page displays the dependencies between services or resources in the form of a topology. By combining threshold values of metrics, you can quickly identify bottlenecks and issues within the system and take timely actions to respond and address them. Additionally, by continuously monitoring and updating the topology analysis path, you can continuously optimize system architecture and performance.

## Overview Introduction

![Overview Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6d7f5039d.png)

- **① Time Selector**: Supports time filter queries. For usage details, please refer to the chapter [Dashboard Details - Time Selector](../dashboard/use/)
- **② Search Snapshot**: Supports saving search conditions as snapshots. For usage details, please refer to the chapter [Query - Search Snapshot](../query/history/)
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the search conditions of the current page. For usage details, please refer to the chapter [Query - Search Snapshot](../query/history/)
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing the tags and metrics in the data table used on the current page
    - Name Default/Full Display: Toggle between displaying the full name or default name of the legend
- **④ Search Box**: Supports searching or grouping by Tag. For usage details, please refer to the chapter [Query](../query/overview/)
- **⑤ Left Quick Filter**: Allows quick data filtering. For usage details, please refer to the chapter [Query - Left Quick Filter](../query/left-quick-filter/)
- **⑥ Area Query**: Supports quickly switching query area data
- **Topology Graph Operations**: Double-click on data nodes to enter the right slide panel to view corresponding information. For usage details, please refer to the chapter [Traffic Topology](../dashboard/panel/topology/)