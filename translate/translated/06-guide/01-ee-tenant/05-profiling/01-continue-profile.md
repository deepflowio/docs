---
title: Continuous Profiling
permalink: /guide/ee-tenant/profiling/continue-profile/
---

> This document was translated by ChatGPT

# Continuous Profiling

For the functional principles, see [Core Features - Explanation of Continuous Profiling](../../../features/continuous-profiling/auto-profiling)

## Overview Introduction

![Overview Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfb068b35.png)

- **① Page Search**: Search bar, search snapshots, etc. For details, please refer to the chapter [Tracing - Resource Analysis](../tracing/service-list/)
- **② Quick Filter**: Supports filtering by `Application List` and `Profiling Type`
  - Application List: Displays the reported service list information, with the default display format as **Service Name (Language Type)**
  - Profiling Type: Displays the `Profiling Type` supported by the profiling method configured on the client
    - Select the `Profiling Type` supported by the current application, different profiling types express different semantics
- **③ Display Switch**: Switch the display mode of performance profiling data, currently supports: Flame Graph, List, and Simultaneous Display
  - Flame Graph: Displays the function call stack in the form of a flame graph
    - **⑥ Tip**: Hover to view information about the Span in the flame graph
      - Function Type:
        - K: Linux Kernel Function
        - L: Function in Dynamic Link Library
        - A: Application Business Function
        - P: Process
        - T: Thread, only appears in the second layer of the flame graph
        - ?: Unknown, function name translation failed, for detailed explanation see [Core Features - Continuous Profiling - Explanation of API Return Result profile_location_str](../../../features/continuous-profiling/api)
      - Span Name
      - Total Consumption: The percentage of total consumption of the Span relative to the root (the first line of the flame graph)
      - Self Consumption: The percentage of self-consumption of the Span relative to the root (the first line of the flame graph)
    - Operation: Click to zoom in and view the call stack of the clicked Span; click again on a blank area to return to the original state
  - Table: Displays the function's `Self Consumption` and `Total Consumption` in list form
    - Default sorted in descending order by `Self Consumption`
  - Simultaneous Selection: View performance profiling data in both `Flame Graph` and `Table` forms simultaneously
    - Clicking on a function in the table will highlight it in the flame graph
- **④ Flame Graph Name Display**: The flame graph can choose to display the head or tail of the name
- **⑤ Data Filter**: Input characters to filter data in the table
