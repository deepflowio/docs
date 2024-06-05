---
title: Path Topology
permalink: /guide/ee-tenant/application/path-topology/
---

> This document was translated by ChatGPT

# Path Topology

The Path Topology page displays the dependencies between services or resources in a topological form. By combining the threshold of metric values, you can quickly identify bottlenecks and issues in the system, and take timely actions to respond and address them. Additionally, by continuously monitoring and updating the path topology, you can continuously optimize the system architecture and performance.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6d7f5039d.png)

- **① Time Selector**: Supports time filter queries. For details, please refer to the section [Dashboard Details - Time Selector](../dashboard/use/)
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to the section [Query - Search Snapshot](../query/history/)
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the search conditions of the current page. For details, please refer to the section [Query - Search Snapshot](../query/history/)
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing the tags and metrics in the data table used on the current page
    - Name Default/Full Display: The legend's name can be displayed in full or default
- **④ Search Box**: Supports searching or grouping by Tag. For details, please refer to the section [Query](../query/overview/)
- **⑤ Left Quick Filter**: Allows quick data filtering. For details, please refer to the section [Query - Left Quick Filter](../query/left-quick-filter/)
- **⑥ Region Query**: Supports quickly switching query region data
- **Topology Operations**: Double-click on a data node to enter the right slide panel to view the corresponding information. For details, please refer to the section [Traffic Topology](../dashboard/panel/topology/)
