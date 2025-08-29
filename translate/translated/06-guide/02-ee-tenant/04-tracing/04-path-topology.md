---
title: Topology Analysis
permalink: /guide/ee-tenant/tracing/path-topology/
---

> This document was translated by ChatGPT

# Topology Analysis

The topology analysis page displays the dependencies between services or resources in the form of a topology. Combined with threshold values for metrics, it enables quick identification of bottlenecks and issues in the system, allowing timely actions for response and resolution. In addition, by continuously monitoring and updating the topology analysis paths, the system architecture and performance can be continuously optimized.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6d7f5039d.png)

- **① Time Selector**: Supports time-based filtering queries. For usage details, please refer to [Dashboard Details - Time Selector](../dashboard/use/).
- **② Search Snapshot**: Supports saving search conditions as snapshots. For usage details, please refer to [Query - Search Snapshot](../query/history/).
- **③ Search Save and Settings**:
  - Save Search: Supports quickly saving the current page's search conditions. For usage details, please refer to [Query - Search Snapshot](../query/history/).
  - Settings: A collection of page setting operations.
    - Database Fields: Supports viewing the tags and metrics from the data table used on the current page.
    - Name Abbreviation/Full Name Display: Choose to display the legend names in full or abbreviated form.
- **④ Search Box**: Supports searching or grouping by Tag. For usage details, please refer to [Query](../query/overview/).
- **⑤ Left Quick Filter**: Allows quick filtering of data. For usage details, please refer to [Query - Left Quick Filter](../query/left-quick-filter/).
- **⑥ Region Query**: Supports quickly switching the query region data.
- **Topology Graph Operations**: Double-click a data node to open the right-side panel and view the corresponding information. For usage details, please refer to [Traffic Topology](../dashboard/panel/topology/).