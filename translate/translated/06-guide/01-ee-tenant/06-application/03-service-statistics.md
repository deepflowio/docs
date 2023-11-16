---
title: Path Statistics
permalink: /guide/ee-tenant/application/service-statistics/
---

> This document was translated by GPT-4

# Path Statistics

Building on the basic metrics statistics page, the path statistics page displays the clients and servers of request applications, allowing a more flexible and comprehensive analysis of application performance metrics. It provides insights into service request rates, response times, and the proportion of exceptions, which aids in identifying system bottlenecks and optimizing system performance.

## Overview

![3_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6ba9e6900.png)

- **① Time Picker**: Supports time filtering queries. For usage details, refer to the chapter on 【[Viewing Details-Time Picker](../dashboard/use/)】.
- **② Search Snapshot**: Allows saving search conditions as a snapshot. For usage details, refer to the chapter on 【[Query-Search Snapshot](../query/history/)】.
- **③ Saving and Setting up Searches**:
  - Search Saving: Allows quick saving of the search conditions of the current page. For usage details, refer to the chapter on 【[Query-Search Snapshot](../query/history/)】.
  - Settings: A collection of page settings operations.
    - Database Fields: Allows viewing of tag, metrics in the datatable used on the current page.
    - Turn on/off Tip Sync: When enabled, can view the metric data of all line charts at the same time point.
    - Switch Fill Method: When data doesn't exist at a certain time point, switch fill method to handle as needed.
    - Switch Stacking: Quickly flip between laying out and stacking all time-series related subviews on function pages.
    - Full/Abbreviated names: Switch between displaying full or abbreviated names for chart legends.
- **④ Search Bar**: Supports searching or grouping of Tags. For usage details, refer to the chapter on 【[Search](../query/overview/)】.
- **⑤ Left-hand Quick Filter**: Allows quick data filtering. For usage details, refer to the chapter on 【[Query-Left-hand Quick Filter](../query/left-quick-filter/)】.
- **⑥ Area Search**: Supports quickly switching area data for queries.
- **Table Operation**:
  - Click Row: Click on table data to quickly access related info of the corresponding app service in the right slide box. For usage details, refer to the chapter on 【[Right Slide Box](./right-sliding-box/)】.
