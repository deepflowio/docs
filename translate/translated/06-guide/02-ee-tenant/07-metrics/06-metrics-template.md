---
title: Metrics Template
permalink: /guide/ee-tenant/metrics/metrics-template/
---

> This document was translated by ChatGPT

# Metrics Template

A collection of metric sets created for different data tables, which can be used in the chart editing and query module.

## Overview

Displays the list of metric templates viewable by the current account, with support for editing, deleting, and other operations. Some data tables contain default templates, which are created by the system and cannot be edited or deleted.

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240514664334ae9febc.png)

- **① Create Template**: Create a metrics template. For details, please refer to the **Create Metrics Template** section.
- **② Switch Data Table**: Switch the data table to view the corresponding metric templates under that table.
- **③ Delete**: Delete a metrics template.
- **④ Edit**: Edit a metrics template.
- **⑤ Expand Row**: Click a table row to quickly expand and view the metrics included in the template. For details, please refer to the figure below **01-Expand Row**.

![01-Expand Row](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643341c20532.png)

## Create Metrics Template

![02-Create Metrics Template](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466433419ccda4.png)

- Template Name: Required. The name of the template being created.
- Team: Required. Select the team that can view the template.
- Data Table: Required. Select the data table to which the template will be added.
- Metrics: Select the metrics to be added.
  - Supports setting aggregation operators, metric aliases, units, thresholds, etc.