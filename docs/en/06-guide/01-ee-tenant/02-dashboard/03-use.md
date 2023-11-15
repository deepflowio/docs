> This document was translated by GPT-4

---

title: View Details
permalink: /guide/ee-tenant/dashboard/use/

---

# View Details

The view details page presents the user-defined visualization panels.

![03-use.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023010963bb90ab68d75.png)

- **① View dropdown box:** The dropdown box options are view names. By selecting a name, you can quickly switch views.
- **② Time picker:** You can customize the time range of the visualization panel data. For detailed usage, please refer to the <mark>Time Picker</mark> section.
- **③ Time interval:** You can choose the granularity of data aggregation. Note: The aggregation time granularity is only applicable to time series graphs: TOP N line charts/line charts/trend analysis charts.
  - Second level: 1、5、10、30s
  - Minute level: 1、5、10、30m
  - Hour level: 1、3、6、12h
  - Day level: 1、7d
- **④ Manual refresh:** You can click the refresh button to refresh the data in real time.
- **⑤ Auto refresh:** By default, the auto-refresh function is turned off. You can choose to turn it on and refresh automatically at a frequency of 1m or 5m.
- **⑥ Full screen:** Click the button to display the current view in full screen. Press `Esc` to exit full screen.
- **⑦ Save:** After modifying the time range of the view, time interval, position of topological sub-view, configuration of sub-view, template variable values, etc., clicking the save button can save your changes. If you want to save it as a copy, you can check the Save As option.
- **⑧ Settings:** In the settings, you can share, export, delete, manage template variables, and perform a series of operations on the view. For detailed usage, please refer to the <mark>Settings</mark> section.

## Time picker

---

title: View Details
permalink: /guide/ee-tenant/dashboard/use/

---

# View Details

The View Details page displays user-customized visualization panels.

![3_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650821cfe6fd6.png)

- **① View Dropdown:** The dropdown options consist of view names. Selecting a name allows for quick view switching.
- **② Time Selector:** You can customize the time range of the visualization panel data. For detailed usage, please refer to the [Time Selector] section.
- **③ Time Interval:** This allows for the selection of data aggregation granularity. Note: Aggregate time granularity is only valid for time series charts: TOP N line charts/line charts/trend analysis charts.
  - Second level: 1、5、10、30s
  - Minute level: 1、5、10、30m
  - Hour level: 1、3、6、12h
  - Day level: 1、7d
- **④ Manual Refresh:** Click the refresh button for a real-time data refresh.
- **⑤ Auto Refresh:** The auto-refresh feature is off by default. You can choose to enable it with a 1m or 5m refresh rate.
- **⑥ Full Screen:** A single click will display the current view in full screen. You may exit by pressing `Esc`.
- **⑦ Save:** After modifications are made to the view's time range, time interval, subview position, subview configuration, template variable values, etc., click the save button to save the changes. If you wish to save a copy, you may check the Save As option.
- **⑧ Settings:** These settings provide a suite of operations for the view, such as share, export, delete, manage template variables, etc. For detailed usage, please refer to the [Settings] section.

## Time Selector

The time selector allows users to view historical data in the `Absolute Time` range and `Relative Time` range.

![3_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508246209950.png)

- Absolute Time:
  - Allows for time range selection from a calendar.
  - Users can manually input a time range using the `YYYY-MM-DD HH-mm-ss` format.
- Relative Time:
  - Quick selection of relative time is supported.
    - Last 5m, 15m, 30m, 6h, 1d, 7d, 30d, etc.
  - Relative time can be manually input using the `now` keyword.
    - `now`: The precise time corresponding to the current year, month, day, hour, minute, and second.
    - `now/d`: Represents the current day. If located at the beginning time, the corresponding precise time is 0h 0m 0s. If located at the ending time, the corresponding time is 23:59:59.
    - `now-$num d`: Represents the most recent num days, with the corresponding precise time being the current time minus the appropriate number of days. Num ranges from 1 to 100.

## Settings

The Settings button on the view page offers a plethora of capabilities to aid users in utilizing views.

![03-set.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023010963bb90d196c14.png)

- Set Global Data Source: Allows for a quick switch of data sources for all subviews on the view's details page.
- Enable/Disable Tip Synchronization: When enabled, time series-related subviews and data information at the same time point can be viewed simultaneously.
  - Time series-related subviews include: TOP N line charts/line charts/trend analysis charts.
- New Module: Subviews can be classified and placed modularly. Modules can be folded and expanded as needed, and their names modified, or even removed within the module bar.
- Switch Fill Method: When data for a certain point in time is missing, a switch fill method may be implemented for tailored responses - Fill 0: fills current time point with 0; Fill null: leaves current time point data empty; Fill none: removes current time point.
- Switch Tile/Stack: Rapid switching between tiled and stacked display formats for all time series-related subviews on the view's details page.
- Full/Abbreviated Display of Names: Rapid toggling of name display methods for all subviews on the view's details page.
