> This document was translated by GPT-4

---

title: Metrics Statistics
permalink: /guide/ee-tenant/application/service-list/

---

# Metrics Statistics

The Metrics Statistics page provides a centralized way to display an overview of the applications and services monitored by DeepFlow. It includes information such as the names of these services, their sources, and golden metrics. Through the Metrics Statistics page, users can quickly grasp the overall state of the application services, easily locate the services they need to pay attention to, and further view the detailed information of the application services for performance analysis, troubleshooting and optimization. This can help improve the efficiency and accuracy of service monitoring.

## Overview Introduction

The Metrics Statistics page supports overview queries of application services through time filter queries, condition search queries, and other methods.

![2_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a602e67679.png)

- **① Time Selector**: Supports time filter queries. For usage details, please refer to the chapter 【[View Details - Time Selector](../dashboard/use/)】
- **② Search Snapshot**: Supports saving the search conditions as a snapshot. For usage details, please refer to the chapter 【[Query - Search Snapshot](../query/history/)】
- **③ Search Save and Settings**:
  - Search Saving: Supports quickly saving the current page's search conditions. For usage details, please refer to the chapter 【[Query - Search Snapshot](../query/history/)】
  - Settings: A collection of page settings operations
    - Field in database: Supports viewing the tags and metrics in the data table used on the current page.
    - Enable/Disable Tip Synchronization: When enabled, metrics data at the same time point on all line graphs can be viewed simultaneously.
    - Toggle Fill Mode: Missing data at a certain time point can be handled by toggling to the desired fill method.
    - Toggle Stacking: Quickly switch between tiled and stacked display modes for all time series sub-views on the function page.
    - Toggle Name Abbreviation/Full Display: Display the full names or abbreviations of the legends.
- **④ Search Box**: Supports searching or grouping by Tag. For usage details, please refer to the chapter 【[Query](../query/overview/)】
- **⑤ Left Quick Filter**: Supports quickly filtering data. For usage details, please refer to the chapter 【[Query - Left Quick Filter](../query/left-quick-filter/)】
- **⑥ Area Query**: Supports quick switching of query area data
- **Table Operations**:
  - Row Clicking: Clicking the data in the table allows quick access to the right slide box to view the corresponding application service's related information. For usage details, please refer to the chapter 【[Right Slide Box](./right-sliding-box/)】
