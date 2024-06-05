---
title: Traffic Topology
permalink: /guide/ee-tenant/dashboard/panel/topology/
---

> This document was translated by ChatGPT

# Traffic Topology

DeepFlow's traffic topology can be used to display the dependencies between services or resources, facilitating better analysis and problem-solving, such as analyzing performance bottlenecks, single points of failure, or potential dependency access issues.

## Overview

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031465f2d3476b5c0.png)

The traffic topology consists of `nodes`, `paths`, and some operations:

- **① Node:** Represents a service or resource, corresponding to the `group` in the search criteria. It can be a container service, cloud server, or region, etc.
- **② Path:** Represents the direction of service or resource, where the `client` accesses the `server`.
- **Operations:** You can hover over or click on `nodes` or `paths`.
  - Hover: Highlight the `node` or `path` to view metrics.
  - Click: View details of the `node` or `path` in a right-slide panel.

### Topology Details

![01-Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031465f2cfe0cb741.png)

- **① Switch Query Area:** If there are multiple storage areas in the previous data, you can quickly switch areas for data queries.
  - Note: If the query criteria are not grouped, there is no `Switch TOP Data` function.
- **② Switch Top Data:** Sort the main metric values of the grouped nodes in descending order.
  - Note: If the query criteria are not grouped, there is no `Switch TOP Data` function.
- **③ Expand Table:** Click to expand or close the table. For details, please refer to the [Expand Table] section.
- **④ Modify Metrics:** You can modify the metrics. For details, please refer to the [Modify Metrics] section.
- **⑤ Settings:** Click to set the `traffic topology`. For details, please refer to the [Settings] section.
- **⑥ Delete:** This is a `Dashboard` capability. If you do not need to display this `traffic topology` in the Dashboard, you can click the delete button to remove it.
- **⑦ Manual Resource Relationship Mode:** In this mode, you can manually add paths between nodes.
- **⑧ Waterfall/Free Topology:** Supports switching the display form of the topology. Free topology is generally used for scenarios with many nodes and complex paths; waterfall topology is generally used for scenarios with fewer nodes and simpler paths.
- **⑨ Auto Layout:** The system arranges the nodes in a tree structure based on the path access relationships.
- **⑩ Random Layout:** The system arranges the nodes in a star structure.
- **⑪ Save Topology:** This is a `Dashboard` capability. After modifying the `traffic topology`, you can choose the `Save Topology` button to save the changes, such as remembering the time range, topology position, topology configuration, and variable template values.
- **⑫ Legend:** You can open the legend to view the meanings of icons and lines. For details, please refer to the [Legend] section.

### Hover TIP

![02-Hover TIP](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031865f7b8291e1be.png)

When the mouse hovers over a `node`, the `path` associated with the `node` is automatically highlighted. When hovering over a `path`, the `nodes` associated with the `path` are automatically highlighted. At the same time, you can view the metrics in the form of a TIP, which can display the metrics corresponding to different `observation points`.

### Hover Display Metrics

![03-Hover Display](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031865f7b826aff77.png)

Taking the mouse hovering over a `path` as an example, the TIP display content is introduced.

- First row: Description and legend display area. The legend explanation is as follows:
  - Application Function
    - A Application: Represents metrics obtained through application instrumentation, currently indicating data with `signal source=OTel`.
    - S System: Represents metrics obtained through eBPF, currently indicating data with `signal source=eBPF`.
    - E Endpoint Network: Represents metrics obtained through traffic capture (BPF), currently indicating data collected from the network card of the client or server.
    - M Middle Network: Represents metrics obtained through traffic capture (BPF), currently indicating data collected from locations other than the network card of the client or server.
  - Network Function: All metrics are derived from traffic capture (BPF).
    - D Network Card: Indicates data collected from the network card of the client or server.
    - K Container Node: Indicates data collected from the network card of the container node.
    - H Host: Indicates data collected from the network card of the host.
    - M Middle Network: Indicates data collected from locations other than the above network cards.
  - Corner Mark: Distinguishes whether the current data collection location is on the client or server.
    - C: Represents the client.
    - S: Represents the server.
- Second row: Hover `node/path` name information.
- Others: Metrics display area.
  - Displays relevant metric values based on the data location.
  - The last column shows the difference of all `observation points`, allowing quick judgment of data inconsistencies in `sent traffic`.
  - Example: As shown in the figure below, it indicates the endpoint network data of the client.
    ![04-Icon](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509427e1c1c9.png)

### Settings

Users can click the gear icon to set the `traffic topology`.

![05-Settings](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031865f7b8295063a.png)

- **Display Full Name:** Display the full name of the node or show it by default.
- **Download CSV Data:** Supports downloading the data information of the `traffic topology`.
- **View API:** View the interface information that generates the `traffic topology`.

### Expand Table

Click the `Expand Table` button to display the metrics of `nodes` and `paths` in the `traffic topology` in a list form, including resource monitoring, path monitoring, and path difference tables.

![06-Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965091707f4009.png)

- Resource Monitoring: Displays the metrics of all nodes in the `traffic topology`.
- Path Monitoring: Displays the metrics of all paths in the `traffic topology`.
- Path Difference: Displays the difference in metrics of all paths in the `traffic topology` at different `observation points`.
- Search: Supports quick search and lookup of table data.
- Settings: Set the display method of column width, such as evenly distributing column width or allocating column width according to content.

### Modify Metrics

Metrics are one of the important components of the Panel. DeepFlow provides shortcuts to help users quickly select metrics, which can be selected from the dropdown menu to display the desired metric data.

![07-Modify Metrics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170932512.png)

- **① Metric Name:** Select the metric name to display the metric in the Panel.
- **② Set as Main Metric:** Click the icon to set the metric as the main metric. When `Switching TOP Data`, the Panel will sort by the main metric value.
- **③ Advanced Settings:** You can add, delete, or modify metrics. For details, please refer to the [Advanced Settings] section.
- **Multi-select/Single-select:** Some Panels support this. In `multi-select` mode, the TIP in the Panel can display multiple metrics, while in `single-select` mode, only one metric can be displayed.

### Advanced Settings

For further settings of metrics, you can click `Modify Metrics -> Advanced Settings` to enter the settings page. As shown in the figure below, it supports users to add or delete metrics, add aggregation functions, modify display names, set thresholds, select metric templates, and other operations.

![08-Advanced Settings](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965091709aebea.png)

- **① Select Template:** Select a `metric template` to quickly switch the current metrics in the popup window.
- **② Clear All:** Clear all metrics in the current popup window with one click.
- **③ Save Template:** Save the current metric settings in the popup window as a `metric template`.
- **④ Metric Column:** Click the input box to pop up a dropdown menu, and select metrics according to the category.
  - **Aggregation - Primary Operator:** Perform function aggregation operations on metrics, supporting functions such as average, sum, maximum, minimum, etc.
  - **Aggregation - Secondary Operator:** Perform secondary calculations based on the data obtained by the `primary operator`.
  - **Name:** Set the display name of the metric.
  - **Unit:** Set the display unit of the metric.
  - **Threshold:** Set the threshold of the metric. When the threshold is exceeded, the `node` or `path` will turn red to indicate a warning.
- **⑤ Enable/Disable Metric:** Show/hide the corresponding metric.
- **⑥ Add Metric:** Add `④ Metric Column` in the current popup window.

### Edit

The topology edit box consists of three parts: `① Chart`, `② Search Criteria`, and `③ Style and Settings`.

![09-Edit](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031365f175fb51d9f.png)

- **① Chart:** The chart is drawn based on `② Search Criteria` and `③ Style and Settings`.
- **② Search Criteria:** For the use of search criteria, please refer to the [Search](../../query/overview/) section.
- **③ Style and Settings:** Set the style, color, and other settings of the chart.
  - **Style:** Rich functions support setting the style of the chart.
    - **Title:** Supports modifying the chart name.
    - **Chart Style:**
      - Full Name Display: Display the full name of the node/abbreviated display.
      - Show Main Metric: When enabled, the main metric value will be displayed on the path.
      - Close Thumbnail: Supports enabling/disabling the thumbnail.
      - Step Line Chart Turning Point: Supports setting the position of the data turning point.
      - Area Fill: Supports filling the area between the line and the coordinate axis with color.
      - Data Stacking: Supports displaying multiple data series in a stacked or tiled manner.
        - Stacked: Displays the values of multiple data series in the same coordinate system in a stacked manner to show their overall trend and individual contributions.
        - Tiled: Displays the values of multiple data series in the same coordinate system in a tiled manner to better show the differences and relationships between them.
    - **Color:** Supports setting the color of paths and nodes.

### Legend

Click `Legend` to view the meanings of icons and lines.

![10-Legend](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170b4c72e.png)
