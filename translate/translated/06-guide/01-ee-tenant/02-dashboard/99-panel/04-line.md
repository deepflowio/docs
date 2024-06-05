---
title: Line Chart
permalink: /guide/ee-tenant/dashboard/panel/line/
---

> This document was translated by ChatGPT

# Line Chart

Line charts display continuous data over time, making them ideal for viewing trends within a specific time range.

In DeepFlow, line charts are categorized into two types: Standard Line Chart and TOP N Line Chart.

- Standard Line Chart: Displays all queried data over time.
- TOP N Line Chart: First, the queried data is grouped and the top N are selected, then the data of these top N services or resources is displayed over time.

## Overview

![00-总览](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664b0fd1d1069.png)

- **① Query Area:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Modify Metrics](./topology/).
- **② Modify Metrics:** Basic operations of the chart. For details, please refer to the section [Traffic Topology](./topology/).
- **③ Settings:** Basic operations of the chart. For details, please refer to the section [Settings].
- **④ Delete:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Overview](./topology/).

### Settings

Users can click the `Settings` button to operate the chart.

![01-设置](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240415661cc68097aa9.png)

- **Edit:** Allows modification and editing of the chart, such as changing search conditions, name, saving view position, opening the original function page of the chart, etc. For details, please refer to the section [Edit].
- **Copy:** A capability within the `Dashboard`, supports copying the chart within the dashboard.
- **Download CSV Data:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Settings](./topology/).
- **View API:** Basic operations of the chart. For details, please refer to the section [Traffic Topology - Settings](./topology/).

### Edit

The line chart editing box consists of three parts: `① Chart`, `② Search Conditions`, and `③ Configuration`.

![02-编辑.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664ac8cae92be.png)

- **① Chart:** The chart is drawn based on `② Search Conditions` and `③ Configuration`.
- **② Search Conditions:** For the usage of search conditions, please refer to the section [Search](../../query/overview/).
- **③ Configuration:** Supports quick switching of chart types, and configuration of chart styles and related functions.
  - **Switch Chart Type:** Allows quick switching of chart types, only supported for charts within the dashboard.
  - **General Configuration:** Rich functionalities to set the chart style.
    - **Chart Information:** Supports editing the chart name and adding descriptions.
      - Title: Supports modifying the chart name.
      - Description: Supports adding related description information to the chart in markdown format, allowing links, images, etc.
    - **Metric Settings:** Supports setting aliases, units, and thresholds for the metrics added in `② Search Conditions`.
    - **Chart Style:** Configuration of the display style of the line chart.
      - Display Form: Can choose from `Line`, `Bar`, or `Point` for drawing.
      - Drawing Method: Can choose from four methods to connect the `Line`.
      - Node Display: Data nodes can be switched to display as hollow circles, hollow squares, solid circles, or solid squares.
      - Line Style: Data lines can be switched to display as solid, dashed, or dotted lines.
      - Area Fill: Can fill the area between the line and the coordinate axis with color.
      - Show Values: Displays the corresponding data series values as the mouse moves.
      - Data Stacking: Supports displaying multiple data series in a stacked or tiled manner.
        - Stacked: Displays the values of multiple data series stacked in the same coordinate system to show their overall trend and individual contributions.
        - Tiled: Displays the values of multiple data series tiled in the same coordinate system to better show their differences and relationships.
    - **Color:** Supports setting the color for the current chart.
    - **Legend:** Sets the display status, position, values, and display form of the legend.
      - Mode: Can choose to display as a legend or table.
      - Position: Supports displaying below or to the right of the chart.
      - Display Values: Can choose to display the `Avg, Max, Min, Max` values of the metrics.
    - **Axis Lines:** Sets the background lines and coordinate axis lines.
      - Background Lines: Supports setting straight lines, grid lines, or turning off background lines.
      - Coordinate Axis Display: Can choose to show or hide the coordinate axis.
    - **Data Filtering:** Can choose to hide data with null values or zero values.
  - **Advanced Configuration:**
    - **Tip:** Configuration of the tip display method.
      - Tip Mode: Can choose from `All`, `Single`, or `Hide`.
        - All: Displays data for all series.
        - Single: Only displays data for the highlighted series selected by the mouse.
        - Hide: Does not display the tip.
      - Series Name: Can show or hide the series name.
    - **Data Filtering:**
      - Value Filling Method: Supports three methods to fill `null data`.
        - Fill 0: Default data filling method.
          - Line Chart: Fills the line chart data as `0`, the tip displays the value as `0`.
          - Bar Chart: Does not display height in the bar chart, the bar chart tip displays the data as `0`.
        - Fill null: No value at the time point.
          - Line Chart: The line chart is interrupted, the tip displays the value as `null`.
          - Bar Chart: Does not display height in the bar chart, the bar chart tip displays the data as `null`.
        - Fill none: No time point.
          - Line Chart: Ignores this point in the line chart and connects to the next point, the tip for this time point displays the tip of the previous time point with data.
          - Bar Chart: Does not display height in the bar chart, the tip for this time point displays the tip of the previous time point with data.
      - Hide Series: Supports hiding `series with all data as 0` or `series with all data as null`.
    - **Data Sorting:**
      - Top Sorting: Supports sorting data in ascending/descending order.
      - Top N: Combined with `Top Sorting`, returns the top few data with the smallest/largest values.
        - Can choose `Top 5`, `Top 10`, `Top 20`.
