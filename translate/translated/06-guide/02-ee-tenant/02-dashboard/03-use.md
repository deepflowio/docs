---
title: Dashboard Details
permalink: /guide/ee-tenant/dashboard/use/
---

> This document was translated by ChatGPT

# Dashboard Details

The dashboard details page displays user-defined visualization panels.

![00-Dashboard Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec281b77db.png)

- **① Dashboard Dropdown:** The dropdown options are dashboard names. Select a name to quickly switch dashboards.
- **② Query Area:** Supports one-click switching of the chart query area, and can also switch the query area directly on the chart.
- **③ Time Picker:** Allows customization of the time range for the visualization panel data. For details, see the **Time Picker** section.
- **④ Time Interval:** Allows selection of the time granularity for data aggregation. Note: Aggregation granularity applies only to time series charts: TOP N line chart / line chart / trend analysis chart.
  - Seconds: 1, 5, 10, 30s
  - Minutes: 1, 5, 10, 30m
  - Hours: 1, 3, 6, 12h
  - Days: 1, 7d
- **⑤ Manual Refresh:** Click the refresh button to update data in real time.
- **⑥ Auto Refresh:** Auto refresh is disabled by default. You can enable it to refresh automatically every 1m or 5m.
- **⑦ Add Chart:** Supports adding charts and groups. For details, see the **Add Chart** section.
- **⑧ Full Screen:** Click the button to display the current dashboard in full screen. Press `Esc` to exit full screen.
- **⑨ Save:** After modifying the dashboard's time range, time interval, topology position, chart configuration, template variable values, query area, etc., click the save button to save the changes. To save as a copy, check the "Save As" option.
- **⑩ Settings:** In the settings menu, you can export, delete, manage template variables, and perform other operations on the dashboard. For details, see the **Settings** section.

## Time Picker

The time picker supports viewing historical dashboard data using either an `absolute time` range or a `relative time` range.

![01-Time Picker](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec28050664.png)

- Absolute Time:
  - Supports selecting a time range from the calendar.
  - Supports manually entering a time range in the `YYYY-MM-DD HH-mm-ss` format.
- Relative Time:
  - Supports quick shortcuts to select relative time ranges:
    - Last 5m, 15m, 30m, 6h, 1d, 7d, 30d, etc.
- Supports entering relative time using the `now` keyword:
  - `now`: The exact time corresponds to the current date and time down to the second.
  - `now/d`: Represents "today". If used as the start time, it corresponds to 00:00:00 today; if used as the end time, it corresponds to 23:59:59 today.
  - `now-$num d`: Represents the last *num* days. The exact time is the current time minus the specified number of days. *num* can be an integer from 1 to 100.
- Search Snapshot Records: Stores historical search times for quick access.

## Add Chart

There are two ways to add charts to a dashboard: add charts directly within the dashboard, or add charts from an external page to the dashboard.

![02-Add Chart in Dashboard](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240514664327cf0b5d6.png)

- Click the `Add Chart` button to add line charts, bar charts, pie charts, overview charts, traffic topology, distribution charts, tables, text, and more. Grouping is also supported.
- For adding charts from an external page, see the **[Add Chart](./add-panel/)** section.

## Settings

The settings button in the dashboard page provides a variety of functions to help users better utilize the dashboard.

![03-Settings](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec3a58224c.png)

- Set Global Data Table: Quickly switch the data table referenced by charts in the dashboard.
- Manage Template Variables: Quickly change chart search conditions. For details, see the **[Template Variables](./variable-template/)** section.
- Enable/Disable Tip Sync: When enabled, you can view data at the same time point across all time series-related charts.
  - Time series-related charts include: line charts, trend analysis charts.
- Create Module: Organize charts into modules. Modules can be collapsed or expanded as needed, and you can rename or delete modules from the module bar.
- Switch Fill Method: When data is missing at a certain time point, choose a fill method to handle it:
  - Fill 0: Fill with 0 at the current time point.
  - Fill null: Leave the current time point empty.
  - Fill none: Remove the current time point.
- Switch Tile/Stack: Quickly toggle between tiled and stacked display for all time series-related charts in the dashboard details page.
- Full/Default Name Display: Quickly toggle the name display mode for all charts in the dashboard details page.