---
title: Resource Analysis
permalink: /guide/ee-tenant/tracing/service-list/
---

> This document was translated by ChatGPT

# Resource Analysis

The Resource Analysis page provides a centralized way to present an overview of the application services monitored by DeepFlow. It includes information such as the name, source, and golden metrics of each application service. Through the Resource Analysis page, users can quickly obtain the overall status of application services, easily locate the services that require attention, and further view detailed information for performance analysis, troubleshooting, and optimization. This helps improve the efficiency and accuracy of service monitoring.

## Overview

The Resource Analysis page supports application service overview queries through time filtering and conditional search.

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a602e67679.png)

- **① Time Selector**: Supports time filtering queries. For usage details, please refer to [Dashboard Details - Time Selector](../dashboard/use/).
- **② Search Snapshot**: Supports saving search conditions as snapshots. For usage details, please refer to [Query - Search Snapshot](../query/history/).
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the current page's search conditions. For usage details, please refer to [Query - Search Snapshot](../query/history/).
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing the tags and metrics in the data table used on the current page
    - Enable/Disable Tip Sync: When enabled, you can view metric data for all line charts at the same time point
    - Switch Fill Method: When data is missing at a certain time point, you can switch the fill method as needed
    - Toggle Stacking: Quickly switch between tiled/stacked display for all time-series related Panels on the page
    - Name Abbreviation/Full Display: Toggle between displaying the full name or abbreviated name in the legend
- **④ Search Box**: Supports searching or grouping by Tag. For usage details, please refer to [Query](../query/overview/).
- **⑤ Left Quick Filter**: Allows quick data filtering. For usage details, please refer to [Query - Left Quick Filter](../query/left-quick-filter/).
- **⑥ Region Query**: Supports quickly switching query data by region
- **Table Operations**:
  - Click Row: Clicking on a table row allows you to quickly open the right sliding box to view related information of the corresponding application service. For usage details, please refer to [Right Sliding Box](./right-sliding-box/).