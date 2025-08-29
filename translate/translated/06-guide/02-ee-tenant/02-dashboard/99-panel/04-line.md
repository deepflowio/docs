---
title: Line Chart
permalink: /guide/ee-tenant/dashboard/panel/line/
---

> This document was translated by ChatGPT

# Line Chart

A line chart displays continuous data that changes over time, making it ideal for viewing data trends within a specific time range.

In DeepFlow, line charts are divided into two types: regular line charts and TOP N line charts.

- Regular line chart: Displays all queried data changes over time.
- TOP N line chart: First groups the queried data and selects the TOP N, then displays the data changes over time for the selected TOP N services or resources.

## Overview

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664b0fd1d1069.png)

- **① Query Area:** Basic chart operations. For usage details, please refer to [Traffic Topology - Modify Metrics](./topology/).
- **② Modify Metrics:** Basic chart operations. For usage details, please refer to [Traffic Topology](./topology/).
- **③ Settings:** Basic chart operations. For usage details, please refer to [Settings].
- **④ Delete:** Basic chart operations. For usage details, please refer to [Traffic Topology - Overview](./topology/).

### Settings

Users can click the `Settings` button to operate on the chart.

![01-Settings](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240415661cc68097aa9.png)

- **Edit:** Allows modification of the chart, such as changing search conditions, name, saving to a different dashboard location, or opening the original chart function page. For usage details, please refer to [Edit].
- **Copy:** A `Dashboard` feature that supports copying charts within a dashboard.
- **Download CSV Data:** Basic chart operation. For usage details, please refer to [Traffic Topology - Settings](./topology/).
- **View API:** Basic chart operation. For usage details, please refer to [Traffic Topology - Settings](./topology/).

### Edit

The line chart edit panel consists of three parts: `① Chart`, `② Search Conditions`, and `③ Configuration`.

![02-Edit.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664ac8cae92be.png)

- **① Chart:** The chart is drawn based on `② Search Conditions` and `③ Configuration`.
- **② Search Conditions:** For usage details, please refer to [Search](../../query/overview/).
- **③ Configuration:** Supports quick switching of chart types, as well as style and related function configurations.
  - **Switch Chart Type:** Quickly switch chart types. Only charts in dashboards support switching.
  - **General Configuration:** Rich features for customizing chart styles.
    - **Chart Info:** Edit chart name and add descriptions.
      - Title: Modify the chart name.
      - Description: Add related description information in markdown format, supporting links, images, etc.
    - **Metric Settings:** Set aliases, units, and thresholds for metrics added in `② Search Conditions`.
    - **Chart Style:** Configure the display style of the line chart.
      - Display Form: Choose from `Line`, `Bar`, or `Point` for plotting.
      - Drawing Method: Choose from four ways to connect `lines`.
      - Node Display: Data points can be displayed as hollow circles, hollow squares, solid circles, or solid squares.
      - Line Style: Data lines can be displayed as solid, dashed, or dotted lines.
      - Area Fill: Fill the area between the line and the axis with color.
      - Show Values: Display corresponding data series values when hovering with the mouse.
      - Data Stacking: Display multiple data series in stacked or tiled form.
        - Stacked: Stack values of multiple data series in the same coordinate system to show overall trends and individual contributions.
        - Tiled: Display values of multiple data series side-by-side in the same coordinate system to better show differences and relationships.
    - **Color:** Set colors for the current chart.
    - **Legend:** Configure legend display status, position, values, and display form.
      - Mode: Display as legend or table.
      - Position: Display below or to the right of the chart.
      - Display Values: Choose to display `Avg`, `Max`, `Min`, or `Max` values of metrics.
    - **Axis Lines:** Configure background lines and axis lines.
      - Background Lines: Set to straight lines, grid lines, or turn off background lines.
      - Axis Display: Choose to show or hide axis lines.
    - **Data Filtering:** Choose to hide null or zero values.
  - **Advanced Configuration:**
    - **Tip:** Configure how tips are displayed.
      - Tip Mode: Choose from `All`, `Single`, or `Hidden`.
        - All: Show data for all series.
        - Single: Show data only for the highlighted series under the mouse.
        - Hidden: Do not display tips.
      - Series Name: Show or hide series names.
    - **Data Filtering:**
      - Fill Method: Three ways to fill `null data`.
        - Fill 0: Default fill method.
          - Line Chart: Fill missing data with `0`, tip shows `0`.
          - Bar Chart: No bar height, tip shows `0`.
        - Fill null: No value at the time point.
          - Line Chart: Line breaks, tip shows `null`.
          - Bar Chart: No bar height, tip shows `null`.
        - Fill none: No time point.
          - Line Chart: Skip the point and connect to the next, tip shows the previous point's value.
          - Bar Chart: No bar height, tip shows the previous point's value.
      - Hide Series: Hide series where `all data is 0` or `all data is null`.
    - **Data Sorting:**
      - Top Sorting: Sort data in ascending/descending order.
      - Top N: Combined with `Top Sorting`, return the smallest/largest N data values.
        - Options: `Top 5`, `Top 10`, `Top 20`.