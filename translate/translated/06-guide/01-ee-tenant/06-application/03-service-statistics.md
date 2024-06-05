---
title: Path Statistics
permalink: /guide/ee-tenant/application/service-statistics/
---

> This document was translated by ChatGPT

# Path Statistics

The Path Statistics page, based on the Resource Statistics page, displays the client and server of the requested application. It allows for more flexible analysis of application performance metrics from multiple dimensions, providing insights into service request rates, response times, and error ratios, which helps in identifying system bottlenecks and optimizing system performance.

## Overview Introduction

![Overview Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6ba9e6900.png)

- **① Time Selector**: Supports time filter queries. For details, please refer to the chapter [Dashboard Details - Time Selector](../dashboard/use/)
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the search conditions of the current page. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing the tags and metrics used in the data table of the current page
    - Enable/Disable Tip Sync: When enabled, you can view the metric data of all line charts at the same time point
    - Switch Interpolation Method: When data does not exist at a certain time point, you can switch the interpolation method to handle it as needed
    - Switch Stacking: Quickly switch the display form of all time-series related Panels on the functional page between tiled/stacked
    - Default/Full Name Display: The legend's name can be displayed in full or default
- **④ Search Box**: Supports searching or grouping by Tag. For details, please refer to the chapter [Query](../query/overview/)
- **⑤ Left Quick Filter**: Allows for quick data filtering. For details, please refer to the chapter [Query - Left Quick Filter](../query/left-quick-filter/)
- **⑥ Area Query**: Supports quickly switching the query area data
- **Table Operations**:
  - Click Row: Clicking on the data in the table allows you to quickly enter the right sliding box to view relevant information of the corresponding application service. For details, please refer to the chapter [Right Sliding Box](./right-sliding-box/)
