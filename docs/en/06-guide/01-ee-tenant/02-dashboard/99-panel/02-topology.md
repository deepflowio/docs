> This document was translated by GPT-4

---

title: Traffic Topology
permalink: /guide/ee-tenant/dashboard/panel/topology/

---

# Traffic Topology

DeepFlow's traffic topology can be used to visualize the dependency relationships between services or resources for a better problem analysis and resolution, such as performance bottlenecks, single point failures, or potential dependency access issues.

## Overview

![2_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170253aed.png)

Traffic topology consists of `nodes`, `paths`, and some operations:

- **① Node:** Represents a service or resource, corresponding to `group` in search conditions, which could be a container service, a cloud server, a region, etc.
- **② Path:** Represents the direction of a service or resource from `client` to `server`.
- **Operation:** Hover or click on `node` or `path`.
  - Hover: Highlights `node` or `path` to check metrics.
  - Click: Checks `node` or `path` details in a right swipe box.

![2_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965093c2239c31.png)

- **① Switch TOP data:** Sorts by the primary metrics of the nodes after grouping in descending order.
  - Note: If the search conditions are not grouped, there is no `Switch TOP data` function.
- **② Toggle Data Table:** Toggles the precision of the data table, for example, 1m for minute-level data, 1s for second-level data.
- **③ Expand Table:** Click to expand or close the table. For more details, refer to the section of 【Expanding Table】.
- **④ Modify Metrics:** Allows for modification of metrics. For more details, refer to the section of 【Modifying Metrics】.
- **⑤ Settings:** Click to change settings for `traffic topology`, for more details, refer to the section of 【Settings】.
- **⑥ Edit:** A capability in `view` that allows editing of sub-views, for example, modifying search conditions, names, changing saved view locations, opening original function pages of sub-views, etc. For more details, refer to the section of 【Editing】.
- **⑦ Delete:** A capability in `view` that if `traffic topology` is not needed in the view, it can be removed by clicking the delete button.
- **⑧ Manually supplement resource relationship mode:** In this mode, paths can be manually added between nodes.
- **⑨ Waterfall/Free Topology:** Supports switching the display format of topology. Free topology is generally used for scenarios with many nodes and complex paths, whereas waterfall topology is generally used for scenarios with fewer nodes and single paths.
- **⑩ Automatic Layout:** The system lays out nodes in a tree structure based on path access relationships.
- **⑪ Random Layout:** The system lays out nodes in a star structure.
- **⑫ Save Topology:** A capability in `view` that when `traffic topology` is modified, the `save topology` button can be selected to save the changes, such as remembering the time range, topology location, topology configuration, memorizing variable template values.
- **⑬ Legend:** Opens the legend to see what the icons and lines represent. For more details, refer to the section of 【Legend】.

## Hover TIP

![2_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230919650917049cd3c.png)

When the mouse hovers over a `node`, it automatically highlights the `paths` associated with the `node`. When it hovers over a `path`, it automatically highlights the `nodes` associated with the `path`. At the same time, metrics can be viewed through the TIP, which can display the metrics corresponding to different `path statistical positions`.

### Hover to Display Metrics

![2_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230919650917062390f.png)

Taking the example of hovering over a `path`, this section introduces the display content of TIP.

- First line: Explanation and legend display area, followed by legend definitions:
  - Application Function
    - A Application: Represents metrics obtained through application code embedment, currently can represent data with the `signal source=OTel`.
    - S System: Represents metrics obtained via the eBPF method, currently can represent data with the `signal source=eBPF`.
    - E Endpoint Network: Represents metrics obtained by network traffic capture (BPF), currently represents data collected from the network cards where the client or server is located.
    - M Middle Network: Represents metrics obtained by network traffic capture (BPF), currently represents data collected from positions other than the network cards where the client or server is located.
  - Network Function: All metrics come from network traffic capture (BPF).
    - D Network Card: Represents data collected from the network cards where the client or server is located.
    - K Container Node: Represents data collected from the network cards of container nodes.
    - H Host: Represents data collected from the network cards of hosts.
    - M Middle Network: Represents data collected from positions other than the above network cards.
  - Corner Mark: Distinguishes whether the current data collection position is at the client or server.
    - C: Represents the client.
    - S: Represents the server.
- Second Line: `Node/Path` name information on hover.
- Other: Metrics display area.
  - Displays relevant metric values based on the viewed data position.
  - The last column is the difference for all `path statistical positions`, for example, this line can be used to quickly determine if there are inconsistencies in `sent traffic`.
  - Example: As shown in the figure below, it represents the endpoint network data of the client.
    ![2_3_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509427e1c1c9.png)

## Settings

Users can click on the gear icon to set the `traffic topology`.

![2_5.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170721de1.png)

- **Display Full Name:** Full name display or default display for node names.
- **Download CSV Data:** Supports downloading of `traffic topology` data information.
- **View API:** Views the API used to generate the `traffic topology`.
- **Complete All Associated Data:** Completes paths of resource nodes with all dependency relationships.
- **Show/Hide Characteristic Associations:** Shows or hides nodes of resources with characteristic associations.
  - Resource nodes include: IP, Virtual machine, router, DHCP gateway, POD, container service, container node, RDS, Redis, Load balancer, NAT gateway, Workload, WAN IP, and others.
- **Thumbnail:** Turns on/off the thumbnail at the bottom left of the `traffic topology`.
- **Color Settings:** Sets the color of the current `traffic topology`.
- **Display Primary Metrics:** Supports displaying primary metric values on `nodes` and `paths`. For more information on `setting primary metrics`, refer to 【Modifying Metrics】.

## Expand Table

Click the `Expand Table` button to show the metrics of `nodes` and `paths` in `traffic topology` in the form of a list, including resource monitoring, path monitoring, and path difference tables.

![2_6.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965091707f4009.png)

- Resource Monitoring: Shows the metrics of all nodes in `traffic topology`.
- Path Monitoring: Shows the metrics of all paths in `traffic topology`.
- Path Difference: Shows the difference in values of all path metrics in different `path statistical positions` in `traffic topology`.
- Search: Supports quick search and find of table data.
- Set: Sets the width display mode of columns, such as even column width, column width assigned according to content.

## Modifying Metrics

Metrics are an important part of sub-views, DeepFlow provides a shortcut to quickly select metrics, you can select the metric data to be displayed in the dropdown box.

![2_7.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170932512.png)

- **① Metric Name:** Selecting a metric name will display it in the sub-view.
- **② Set as Primary Metric:** Clicking the icon will set the metric as the primary metric, the sub-view is sorted by the primary metric value when `switching TOP data`.
- **③ Advanced Setting:** Allows for adding, deleting, and modifying of metrics. For more details, refer to the section of 【Advanced Setting】.
- **Multi-choice/Single-choice:** Some sub-views support this. When `multiple-choice` is selected, multiple metrics can be displayed in the TIP of the sub-view; when `single-choice` is selected, only one metric can be displayed.

### Advanced Setting

For further setting of metrics, the setting page can be accessed by clicking `Modify Metrics -> Advanced Setting`. As shown below, users are supported to add or delete metrics, add aggregate functions, modify display names, set threshold values, select metric templates, etc.

![2_8.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965091709aebea.png)

- **① Select Template:** Select a `metric template` to quickly switch the metric template in the current pop-up window.
- **② Clear All:** Clears all metrics in the current pop-up window.
- **③ Save Template:** Saves the settings of the metrics in the current pop-up window as a `metric template`.
- **④ Metric Column:** Click on the input box to pop up the drop-down box to select a metric based on classification.
  - **Aggregation - First-level Operator:** Functions such as averaging, summing, taking maximum value, minimum value, etc., can be applied to aggregate metrics.
  - **Aggregation - Second-level Operator:** Secondary calculations based on the data obtained by the `first-level operator`.
  - **Name:** Sets the display name of the metric.
  - **Unit:** Sets the display unit of the metric.
  - **Threshold:** Sets the threshold of the metric, when the threshold is exceeded, the `node` or `path` turns red to alert.
- **⑤ Enable/Disable Metric:** Shows/hides corresponding metrics.
- **⑥ Add Metric Column:** Adds `④ Metric Column` to the current pop-up window.

## Edit

Editing is a capability in `view` where `traffic topology` can be modified using the `edit` button.

![2_9.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965091bb83ac9a.png)

- **① Name:** Modify the name of the sub-view.
- **② View:** Change the view to which the sub-view belongs.
- **③ Save As:** Save the modified sub-view separately, without changing the current sub-view information.
- **④ Search Condition:** Modify search conditions of the sub-view.
  - Edit Search Condition: For more details, refer to the section on 【[Search](../../query/overview/)】

## Legend

Click on `Legend` to see what icons and lines represent.

![2_10.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509170b4c72e.png)
