---
title: Table
permalink: /guide/ee-tenant/dashboard/panel/table/
---

> This document was translated by ChatGPT

# Table

Tables are used to display detailed information of structured data. DeepFlow tables are divided into two types: `Aggregate Table` and `Detail Table`.

## Aggregate Table

Aggregate tables support querying data from multiple tables of the same type at the same time, for example, `Service Metrics`, `Path Metrics`, or `xx Logs`.

![01-Aggregate Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f90497a37.png)

- **① Query Area:** Basic chart operation. For usage details, please refer to [Traffic Topology - Modify Metrics](./topology/) section.
- **② Modify Metrics:** Basic chart operation. For usage details, please refer to [Traffic Topology - Overview](./topology/) section.
  - Long press and drag data to map the data order to the table.
- **③ Settings:** Basic chart operation. For usage details, please refer to [Traffic Topology - Settings](./topology/) section.
- **④ Delete:** A capability in the `Dashboard`. For usage details, please refer to [Traffic Topology - Overview](./topology/) section.

### Edit

The edit panel of an aggregate table consists of three parts: `① Chart`, `② Search Criteria`, and `③ Configuration`.

![02-Edit](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff296a339.png)

- **① Chart:** The chart is drawn based on `② Search Criteria` and `③ Configuration`.
- **② Search Criteria:** For usage of search criteria, please refer to [Search](../../query/overview/) section.
- **③ Configuration:** Supports quick switching of chart types, and configuring chart styles and related functions.
  - **Switch Chart Type:** Basic chart function. For usage details, please refer to [Line Chart](./line/) section.
  - **Common Configurations:** Rich functions to set chart styles.
    - **Chart Info:** Basic chart function. For usage details, please refer to [Line Chart](./line/) section.
    - **Color:** Set the basic color for chart text or background.
      - Note: Only effective for columns with `Column Settings - Color` enabled.
    - **Column Settings:** Supports setting column color, alignment, value display, etc.
      - Color: Choose the coloring target for the configured color — none, text, or background.
      - Column Alignment: Choose column alignment — left, center, or right.
      - Value Mapping: Match specified column values in three ways and replace them with custom text.
        - Text: Match by string.
        - Range: Match by numeric range.
        - Regular Expression: Match by regular expression.
        - Note: Value mapping priority is `Text > Range = Regular Expression`. When conditions have the same priority, the one higher in the list takes effect.
      - Threshold: Set a numeric range. Data within the range will display specified colors for text/background.
      - Unit: Set the unit for the metric.
      - Alias: Set an alias for the metric.
  - **Advanced Configurations:**
    - **Cell:** Supports configuring the table copy function.
      - Copy Function: Enable or disable the ability to copy table content.
      - Copy Content: Choose the data content to copy.
        - Copy Data: Only copy the data content of the current cell, i.e., `value`.
        - Positive Filter Condition: Copy content in the format `key: value`. You can paste it into the page search bar, which will quickly recognize it as a `search tag` for querying.
        - Negative Filter Condition: Copy content in the format `key!: value`. You can paste it into the page search bar, which will quickly recognize it as a `search tag` for querying.
          - For usage details of search tags, please refer to [Service Search Box](../../query/service-search/) section.
    - **Table Settings:** Supports setting the table border and header.

## Detail Table

Detail tables only support querying a single type of log data, for example, flow logs or call logs.

![03-Detail Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f7906c908.png)

- **① Query Area:** Basic chart operation. For usage details, please refer to [Traffic Topology - Modify Metrics](./topology/) section.
- **② Column Selection:** Supports searching, adding, and deleting column options available in the current table.
  - Long press and drag data to map the data order to the table.
- **③ Settings:** Basic chart operation. For usage details, please refer to [Traffic Topology - Settings](./topology/) section.
- **④ Delete:** A capability in the `Dashboard`. For usage details, please refer to [Traffic Topology - Overview](./topology/) section.

### Edit

The edit panel of a detail table consists of three parts: `① Chart`, `② Search Criteria`, and `③ Configuration`.

![04-Edit](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff2835cce.png)

- **① Chart:** The chart is drawn based on `② Search Criteria` and `③ Configuration`.
- **② Search Criteria:** For usage of search criteria, please refer to [Search](../../query/overview/) section.  
  > Note: Detail tables do not support adding multiple query conditions.
- **③ Configuration:** For usage details, please refer to [Aggregate Table - Edit] section.