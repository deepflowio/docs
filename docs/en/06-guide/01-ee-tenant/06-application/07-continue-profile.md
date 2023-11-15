> This document was translated by GPT-4

---

title: Continuous Profiling
permalink: /guide/ee-tenant/application/continue-profile/

---

# Continuous Profiling

Continuous profiling at the language level, currently supporting data visualization for Java & Golang.

## Overview

![01_Continuous Profiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310206532521185998.jpg)

- **① Region**: Choose the query area
- **② Application List**: Supports aggregated display of reported service list information, the default display method is **service name (language type)**
- **③ Profiling Type**: Support to display the `profiling type` that this profiling method supports according to the customer's configured profiling method
- **④ Tag Filtering**: Supports filtering the Tag in the `profiling data` table
- **⑤ Group Type**: Currently only supports full names
- **⑥ Display Switching**: Used for switching the display of profiling data, currently supports: flame graph, list, and simultaneous display
- **⑦ Data Filtering**: Used for static filtering of table data
- **⑧ Sort Priority**: Used for sorting and filtering of stack information display, default is header priority

## How to Use

- Click ① to select a specific application list, supporting Java and Golang applications
- Click ② to select the `profiling type` supported by the current application, different profiling types express different semantics
- Click ③ to select the Tag data that needs to be filtered, including the meta-information included in the data and the meta-information added by DeepFlow
- Click ④ to select the supported group type, currently only supports **full names**
- Check ⑤ to determine the meaning expressed by the current profiling type and the data reporting trend in the current time window
- Click ⑥ to determine the way to display profiling data, currently supports the following:
  - Flame Graph: Can clearly express function call stack, usage rate, and other information
  - Table: Intuitively displays all function full names and the total resource usage and individual metrics currently in use
  - Simultaneous Selection: Show multiple expressions in one view, currently does not support linkage of the two
- Click ⑦ to input any character of the permission name to filter data
- Click ⑧ to switch the current sorting and filtering rules by default, is header priority. When focusing on the content of the function, you can choose tail priority.
