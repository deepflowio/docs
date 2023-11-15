> This document was translated by GPT-4

---

title: Line Chart
permalink: /guide/ee-tenant/dashboard/panel/line/

---

# Line Chart

A line chart displays data that changes over time, making it very suitable for viewing the trend of data within a certain time range.

In DeepFlow, the line charts are divided into two types: the regular line chart and the TOP N line chart.

- Regular Line Chart: Displays the variation of the entire queried data over time
- TOP N Line Chart: First, the queried data is categorized into TOP N, then the variation of data of the obtained TOP N services or resources over time is displayed.

## Line Chart

### Overview

![4_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095d3e238cb.png)

- **① Switch TOP data:** Basic operation of the subview, for details on use, please refer to the section ["Traffic Topology - Overview Introduction"](./topology/)
- **② Change metric amount:** Basic operation of the subview, for details on use, please refer to the section ["Traffic Topology"](./topology/)
- **③ Settings:** Basic operation of the subview, for details on use, please refer to the "Settings" section
- **④ Delete:** Basic operation of the subview, for details on use, please refer to the section ["Traffic Topology - Overview Introduction"](./topology/)

### Settings

Users can click the `gear` button to operate on the subview.

![4_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095d3f1f856.png)

- **Edit:** Ability in the `view`, can modify the subview, such as modify search conditions, name, change the saved view location, open the subview original function page, etc., for details on use, please refer to the "Edit" section
- **Copy:** Ability in the `view`, supports the copying of subviews within the view
- **Download CSV data:** Basic operation of the subview, for details on use, please refer to the section ["Traffic Topology - Settings"](./topology/)
- **View API:** Basic operation of the subview, for details on use, please refer to the section ["Traffic Topology - Settings"](./topology/)

### Edit

The subview edit box consists of three parts, namely ① `Subview`, ② `Search conditions`, and ③ `Style and settings`.

![4_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230919650967d61bc29.png)

- **① Subview:** The subview is drawn based on ② `Search conditions` and ③ `Style and settings`
- **② Search conditions:** For the use of search conditions, please refer to the section ["Search"](../../query/overview/)
- **③ Styles and settings:** Set the style, name, etc. of the subview
  - **Style:** Various functions are available to set the style of the subview
    - **Title:** Supports modifying the name of the subview
    - **Chart style:**
      - Display form: Line chart can switch display methods, can switch display between line chart, bar chart, and scatter chart
      - Node display: data nodes can be alternatively displayed as hollow circles, hollow matrices, solid circles, solid matrices
      - Line style: data lines can be alternatively displayed as solid, dashed, and dotted lines
      - Inflection point of step line chart: Supports setting the position of the data turning point
      - Area fill: Supports the coloring fill of the area between the line and coordinate
      - Data stacking: Supports displaying multiple data series in a stacked or tiled mode
        - Stacked: Display multiple data series values in the same coordinate system in a stacked mode to show their overall trend and individual contributions
        - Tiled: Display multiple data series values in the same coordinate system in a tiled mode to better show the differences and relations between them
    - **Tooltip:** Can set the Tip prompt method when the mouse hovers over
    - **Legend:** Set the display status, position, full display of the legend name, and filtered display of the legend
    - **Layout:** Set the position of the line chart within the display box
    - **Axis:** Set the angle of the coordinate and whether to display the scales or not
    - **Data filtering:** You can choose to hide null or zero data
  - **Settings:**
    - Completion method: Supports three methods to fill in `empty data`
      - Fill 0: The default data filling method
        - Line chart: Fill in the line chart data as `0`, the displayed tip value is `0`
        - Bar chart: The bar chart does not display the height, the displayed bar chart tip data is `0`
      - Fill null: There is no value at the time point
        - Line chart: The line chart is interrupted, the displayed tip value is `empty`
        - Bar chart: The bar chart does not display the height, the displayed tip data is `empty`
      - Fill none: There is no time point
        - Line chart: The line chart ignores this point and connects it to the next point, this time point's tip displays the tip of the last data-filled time point
        - Bar chart: The bar chart does not display the height, this time point's tip displays the tip of the last data-filled time point
    - Top sorting: Supports ascending/descending sorting of data
