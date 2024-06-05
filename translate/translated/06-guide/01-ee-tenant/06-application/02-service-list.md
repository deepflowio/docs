---
title: Resource Statistics
permalink: /guide/ee-tenant/application/service-list/
---

> This document was translated by ChatGPT

# Resource Statistics

The Resource Statistics page provides a centralized way to present an overview of the application services monitored by DeepFlow. It includes information such as the names of various application services, their sources, and key metrics. Through the Resource Statistics page, users can quickly obtain an overall status of the application services, easily locate the services that need attention, and further view detailed information for performance analysis, fault diagnosis, and optimization. This helps improve the efficiency and accuracy of service monitoring.

## Overview Introduction

The Resource Statistics page supports time filter queries, conditional search queries, and other methods for application service overview queries.

![Overview Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a602e67679.png)

- **① Time Selector**: Supports time filter queries. For details, please refer to the chapter [Dashboard Details - Time Selector](../dashboard/use/)
- **② Search Snapshot**: Supports saving search conditions as snapshots. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
- **③ Search Save and Settings**:
  - Search Save: Supports quickly saving the search conditions of the current page. For details, please refer to the chapter [Query - Search Snapshot](../query/history/)
  - Settings: A collection of page setting operations
    - Database Fields: Supports viewing the tags and metrics used in the data table of the current page
    - Enable/Disable Tip Sync: When enabled, you can view the metric data of all line charts at the same time point
    - Switch Interpolation Method: When data does not exist at a certain time point, you can switch the interpolation method to handle it as needed
    - Switch Stacking: Quickly switch the display form of all time-series related Panels on the functional page between tiled/stacked
    - Default/Full Name Display: Display the full name or default name of the legend
- **④ Search Box**: Supports searching or grouping by Tag. For details, please refer to the chapter [Query](../query/overview/)
- **⑤ Left Quick Filter**: Allows quick data filtering. For details, please refer to the chapter [Query - Left Quick Filter](../query/left-quick-filter/)
- **⑥ Region Query**: Supports quickly switching query region data
- **Table Operations**:
  - Click Row: Clicking on the data in the table allows you to quickly enter the right sliding box to view the relevant information of the corresponding application service. For details, please refer to the chapter [Right Sliding Box](./right-sliding-box/)
