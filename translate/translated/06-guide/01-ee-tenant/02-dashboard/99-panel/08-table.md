---
title: Table
permalink: /guide/ee-tenant/dashboard/panel/table/
---

> This document was translated by ChatGPT

# Table

Tables are used to display detailed information of structured data. DeepFlow tables can be divided into two types: `Aggregate Table` and `Detail Table`.

## Aggregate Table

Aggregate tables support querying data from multiple tables of the same type simultaneously, such as `Service Metrics`, `Path Metrics`, or `xx Logs`.

![01-Aggregate Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f90497a37.png)

- **① Query Area:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Modify Metrics](./topology/)
- **② Modify Metrics:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Overview](./topology/)
  - Long press and drag data to map the sorting to the table
- **③ Settings:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Settings](./topology/)
- **④ Delete:** A capability within the `Dashboard`. For details, please refer to the section [Traffic Topology - Overview](./topology/)

### Edit

The editing box of the aggregate table consists of three parts: `① Chart`, `② Search Conditions`, and `③ Configuration`.

![02-Edit](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff296a339.png)

- **① Chart:** The chart is drawn based on `② Search Conditions` and `③ Configuration`
- **② Search Conditions:** For the usage of search conditions, please refer to the section [Search](../../query/overview/)
- **③ Configuration:** Supports quick switching of chart types, and configuration of chart styles and related functions
  - **Switch Chart Type:** Basic functionality of the chart. For details, please refer to the section [Line Chart](./line/)
  - **Common Configuration:** Rich functionalities to set the chart style
    - **Chart Information:** Basic functionality of the chart. For details, please refer to the section [Line Chart](./line/)
    - **Color:** Set the basic color for the text or background of the chart
      - Note: Only effective for columns with `Column Settings - Color` enabled
    - **Column Settings:** Supports setting the color, alignment, and value display of columns
      - Color: Select the object to be colored from the configured colors, can choose none, text, or background
      - Column Alignment: Choose the alignment position of the column, can choose left, center, or right
      - Value Mapping: Three ways to match specified column values and replace them with custom text content
        - Text: Match through strings
        - Range: Match through numerical ranges
        - Regular Expression: Match through regular expressions
        - Note: The priority of value mapping effectiveness is `Text > Range = Regular Expression`. When there are matching conditions of the same priority, the one higher in the order takes effect
      - Threshold: Set the numerical range, and the text/background within the specified range will display the specified color
      - Unit: Set the unit of the metric
      - Alias: Set the alias of the metric
  - **Advanced Configuration:**
    - **Cell:** Supports setting the configuration of the table copy function
      - Copy Function: Enable or disable the table content copy function
      - Copy Content: Choose the data content to be copied
        - Copy Data: Only copy the data content of the current cell, i.e., `value`
        - Forward Filter Condition: The copy content format is `key: value`, which can be pasted into the search bar on the page. The search bar can quickly recognize it as a `search tag` for querying
        - Reverse Filter Condition: The copy content format is `key!: value`, which can be pasted into the search bar on the page. The search bar can quickly recognize it as a `search tag` for querying
          - For details on using search tags, please refer to the section [Service Search Box](../../query/service-search/)
    - **Table Settings:** Supports setting the border and header of the table

## Detail Table

Detail tables only support querying a single type of log data, such as flow logs or call logs.

![03-Detail Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f7906c908.png)

- **① Query Area:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Modify Metrics](./topology/)
- **② Column Selection:** Supports searching, adding, and deleting column options supported by the current table
  - Long press and drag data to map the sorting to the table
- **③ Settings:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Settings](./topology/)
- **④ Delete:** A capability within the `Dashboard`. For details, please refer to the section [Traffic Topology - Overview](./topology/)

### Edit

The editing box of the detail table consists of three parts: `① Chart`, `② Search Conditions`, and `③ Configuration`.

![04-Edit](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff2835cce.png)

- **① Chart:** The chart is drawn based on `② Search Conditions` and `③ Configuration`
- **② Search Conditions:** For the usage of search conditions, please refer to the section [Search](../../query/overview/)
  > Note: Detail tables do not support adding multiple search conditions
- **③ Configuration:** For details, please refer to the section [Aggregate Table - Edit]
