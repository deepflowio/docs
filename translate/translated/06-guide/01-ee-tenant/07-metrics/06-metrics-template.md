---
title: Metrics Template
permalink: /guide/ee-tenant/metrics/metrics-template/
---

> This document was translated by ChatGPT

# Metrics Template

A series of metric collections established for different data tables, which can be used in the chart editing query module.

## Overview

Displays the metric templates that the current account can view in a list format, and supports operations such as editing and deleting. Some data tables include default templates, which are created by the system and cannot be edited or deleted.

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240514664334ae9febc.png)

- **① Create Template**: Create a metric template. For usage details, please refer to the [Create Metric Template](#create-metric-template) section.
- **② Switch Data Table**: Switch data tables to view the metric templates under the corresponding data table.
- **③ Delete**: Delete a metric template.
- **④ Edit**: Edit a metric template.
- **⑤ Row Expand**: Click on the table row to quickly expand and view the metrics included in the template. For details, please refer to the image below [01-Row Expand](#01-row-expand).

![01-Row Expand](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643341c20532.png)

## Create Metric Template

![02-Create Metric Template](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466433419ccda4.png)

- Template Name: Required, the name of the newly created template.
- Team: Required, select the team that can view the template.
- Data Table: Required, select the data table to which the template will be added.
- Metrics: Select the metrics to be added.
  - Supports setting aggregation operators, metric aliases, units, thresholds, etc.