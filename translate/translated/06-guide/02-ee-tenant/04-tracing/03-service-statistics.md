---
title: Path Analysis
permalink: /guide/ee-tenant/tracing/service-statistics/
---

> This document was translated by ChatGPT

# Path Analysis

The Path Analysis page, based on the Resource Analysis page, displays both the client and server of application requests. It allows for more flexible and multi-dimensional analysis of application performance metrics, providing insights into service request rate, response time, and error ratio, which helps identify system bottlenecks and optimize performance.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6ba9e6900.png)

- **① Time Selector**: Supports time-based filtering queries. For details, please refer to [Dashboard Details - Time Selector](../dashboard/use/).
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to [Query - Search Snapshot](../query/history/).
- **③ Search Save and Settings**:
  - Save Search: Supports quickly saving the current page's search conditions. For details, please refer to [Query - Search Snapshot](../query/history/).
  - Settings: A collection of page setting operations.
    - Database Fields: Supports viewing the tags and metrics used in the data table on the current page.
    - Enable/Disable Tip Sync: When enabled, you can view metric data for all line charts at the same time point simultaneously.
    - Switch Interpolation Method: When data is missing at a certain time point, you can switch the interpolation method as needed.
    - Toggle Stacking: Quickly switch between tiled/stacked display formats for all time-series related Panels on the page.
    - Name Abbreviation/Full Name Display: Choose whether to display legend names in full or abbreviated form.
- **④ Search Box**: Supports searching or grouping by Tag. For details, please refer to [Query](../query/overview/).
- **⑤ Left Quick Filter**: Allows quick data filtering. For details, please refer to [Query - Left Quick Filter](../query/left-quick-filter/).
- **⑥ Region Query**: Supports quickly switching query data by region.
- **Table Operations**:
  - Click Row: Clicking on a table row allows you to quickly open the right sliding box to view related information about the corresponding application service. For details, please refer to [Right Sliding Box](./right-sliding-box/).