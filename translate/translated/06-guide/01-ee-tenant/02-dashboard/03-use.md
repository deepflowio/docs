---
title: Dashboard Details
permalink: /guide/ee-tenant/dashboard/use/
---

> This document was translated by ChatGPT

# Dashboard Details

The dashboard details page displays user-customized visualization panels.

![00-Dashboard Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec281b77db.png)

- **① Dashboard Dropdown:** The dropdown options are the names of the dashboards. Selecting a name allows for quick switching between dashboards.
- **② Query Area:** Supports quick one-click switching of chart query areas, and also allows switching query areas on the chart.
- **③ Time Picker:** Allows customization of the time range for the visualization panel data. For details, please refer to the [Time Picker] section.
- **④ Time Interval:** Allows selection of the data aggregation time granularity. Note: Aggregation time granularity is only effective for time series charts: TOP N line charts/line charts/trend analysis charts.
  - Second level: 1, 5, 10, 30s
  - Minute level: 1, 5, 10, 30m
  - Hour level: 1, 3, 6, 12h
  - Day level: 1, 7d
- **⑤ Manual Refresh:** Click the refresh button to refresh the data in real-time.
- **⑥ Auto Refresh:** Auto-refresh is disabled by default. You can choose to enable auto-refresh at 1m or 5m intervals.
- **⑦ Create New Panel:** Supports charts and groups. For details, please refer to the [Add Chart] section.
- **⑧ Full Screen:** Click the button to display the current dashboard in full screen. Press `Esc` to exit full screen.
- **⑨ Save:** After modifying the time range, time interval, topology position, chart configuration, template variable values, query area, etc., click the save button to save the changes. If you want to save it as a copy, you can check the save as option.
- **⑩ Settings:** In the settings option, you can export, delete, manage template variables, and perform a series of operations on the dashboard. For details, please refer to the [Settings] section.

## Time Picker

The time picker supports users in viewing historical data of the dashboard using either `absolute time` range or `relative time` range.

![01-Time Picker](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec28050664.png)

- Absolute Time:
  - Supports selecting a time range from the calendar.
  - Supports manually entering the time range in the `YYYY-MM-DD HH-mm-ss` format.
- Relative Time:
  - Supports shortcuts for quickly selecting relative time.
    - Last 5m, 15m, 30m, 6h, 1d, 7d, 30d, etc.
- Supports entering relative time using the `now` keyword.
  - `now`: Corresponds to the exact current time in year, month, day, hour, minute, and second.
  - `now/d`: Represents today. If used as the start time, it corresponds to 00:00:00 of today; if used as the end time, it corresponds to 23:59:59 of today.
  - `now-$num d`: Represents the last num days. The exact time corresponds to the current time minus the specified number of days, where num is an integer between 1 and 100.
- Search Snapshot Records: Records the historical search times for quick viewing.

## Add Chart

There are two ways to add charts to the dashboard: you can add charts within the dashboard or add charts from external pages to the dashboard.

![02-Add Chart in Dashboard](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240514664327cf0b5d6.png)

- Click the `Add Chart` button to add types of charts such as line charts, bar charts, pie charts, overview charts, traffic topology, distribution charts, tables, text, etc. Grouping is also supported.
- For adding charts from external pages, please refer to the [Add Chart](./add-panel/) section.

## Settings

The settings button on the dashboard page is equipped with a variety of functions to facilitate better use of the dashboard.

![03-Settings](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031165eec3a58224c.png)

- Set Global Data Table: Quickly switch the data table referenced by the charts within the dashboard.
- Manage Template Variables: Quickly change the search conditions of the charts. For details, please refer to the [Template Variables](./variable-template/) section.
- Enable/Disable Tip Sync: When enabled, you can view data information at the same time point across time series-related charts.
  - Time series-related charts include: line charts, trend analysis charts.
- Create New Module: Charts can be categorized and placed by module. Modules can be collapsed and expanded as needed. You can modify the name or delete the module in the module bar.
- Switch Fill Mode: When data does not exist at a certain time point, you can switch the fill mode to handle it as needed.
  - Fill 0: Fill the current time point with 0.
  - Fill null: The current time point data is empty.
  - Fill none: Exclude the current time point.
- Switch Tile/Stack: Quickly switch the display form of all time series-related charts on the dashboard details page between tile and stack.
- Toggle Full/Default Name Display: Quickly switch the name display mode of all charts on the dashboard details page.
