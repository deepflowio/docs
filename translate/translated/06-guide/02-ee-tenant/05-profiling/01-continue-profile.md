---
title: Continuous Profiling
permalink: /guide/ee-tenant/profiling/continue-profile/
---

> This document was translated by ChatGPT

# Continuous Profiling

For the working principle, see [Core Features - Continuous Profiling Description](../../../features/continuous-profiling/auto-profiling)

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfb068b35.png)

- **① Page Search**: Search bar, search snapshots, and other functions. For usage details, please refer to the section [Tracing - Resource Analysis](../tracing/service-list/)
- **② Quick Filter**: Supports filtering by `Application List` and `Profiling Type`
  - Application List: Displays the list of reported services. The default display format is **Service Name (Language Type)**
  - Profiling Type: Displays the `Profiling Types` supported by the profiling method configured on the client
    - Select the `Profiling Type` supported by the current application. Different profiling types represent different semantics
- **③ Display Switch**: Switch the display mode of performance profiling data. Currently supports: Flame Graph, Table, and Both
  - Flame Graph: Displays the function call stack in the form of a flame graph
    - **⑥ Tip**: Hover to view information about the Span in the flame graph
      - Function Type:
        - K: Linux kernel function
        - L: Function in a dynamic link library
        - A: Application business function
        - P: Process
        - T: Thread, only appears on the second layer of the flame graph
        - ?: Unknown, function name failed to translate. For detailed explanation, see [Core Features - Continuous Profiling - Viewing Data - About Function Type](../../../features/continuous-profiling/data/)
      - Span Name
      - Total Consumption: Percentage of the Span's total consumption relative to the root (first row of the flame graph)
      - Self Consumption: Percentage of the Span's self consumption relative to the root (first row of the flame graph)
    - Operation: Click to zoom in and view the call stack of the clicked Span; click on a blank area to return to the original state
  - Table: Displays `Self Consumption` and `Total Consumption` of functions in a list format
    - Default sorting is in descending order by `Self Consumption`
  - Both: View performance profiling data in both `Flame Graph` and `Table` formats simultaneously
    - Clicking a function in the table will highlight it in the flame graph
- **④ Flame Graph Name Display**: Choose whether to display the head or tail of the name in the flame graph
- **⑤ Data Filter**: Enter characters to filter data in the table