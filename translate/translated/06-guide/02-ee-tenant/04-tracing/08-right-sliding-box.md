---
title: Right Sliding Panel
permalink: /guide/ee-tenant/tracing/right-sliding-box/
---

> This document was translated by ChatGPT

# Right Sliding Panel

Clicking on a table row, line chart legend, topology diagram, or similar elements on a functional page will bring up the right sliding panel, which displays detailed information about the clicked data. The right sliding panel offers multiple features, including Knowledge Graph, Traffic Relationship, Application Metrics, Endpoint List, Call Logs, Distributed Tracing, Network Metrics, Network Path, Flow Logs, NAT Tracing, Events, and more, to meet different user needs. You can select the corresponding feature based on actual requirements to view and analyze data, enabling faster problem detection and resolution, and improving work efficiency.

The following sections provide detailed instructions for each feature.

## Knowledge Graph

The Knowledge Graph displays all Tags associated with the clicked data object in both list and topology formats.

![Knowledge Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab0460298a.png)

- **Knowledge List**: Displays all Tags associated with the clicked data object in key-value pairs, categorized into `Universal Tag (resource tags)`, `Custom Tag`, and `others`.
  - Note: If the clicked data is from the `Call Series Page`, categories will be distinguished between Client and Server.
  - Operations: Supports searching, category filtering, and empty value filtering for key-value pairs.
    - Search: Supports quick search across data in `Select All`.
    - Left-side category filter: Check the categories to display for quick content filtering.
    - Show/Hide empty tags: Show or hide tags with a value of `--`.
    - Hover over a tag and click the `copy` icon to quickly copy it.
      - Paste the copied content into the search bar, which can be converted into a search tag. For details on using search tags, refer to the **[Service Search Box](../query/service-search/)** section.
- **Knowledge Graph**: Displays the relationships between Tags in a star topology. Clicking a node shows its associated nodes.

## Traffic Relationship

The upper section displays upstream and downstream metrics of the clicked data object in a table. Clicking a row uses DeepFlow’s proprietary flow tracing algorithm to trace the `access data` through observation points in the virtual or physical network.

![Traffic Relationship](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fad66aac.png)

- **① Dropdown:** Click to select the object whose traffic relationship you want to view. If the clicked data is from the `Path Data Page`, there will be two objects.
- **② Role:** Check `As Client` or `As Server` to view metrics when the current object acts as a `Client` or `Server`.

![Virtual - Link Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fae1d9bb.png)

The link topology is sorted from left to right according to the observation points the `access data` passes through, e.g., Client Application -> Client Process -> Client NIC -> ... -> Server NIC -> Server Process -> Server Application.

- Note: Each `node` in the topology represents aggregated information from the same observation point.
- Hover: View metric information.

![Virtual - Detail Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fafcb207.png)

The detail table shows detailed information for each observation point of the `access data`, including the resource it belongs to, data collection location, tunnel information, and metric details.

- Clicking a row will open the detailed information of the clicked observation point in the right sliding panel.

![Virtual - Bar Chart](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664460986c6da.png)

The bar chart displays the same data as the link topology but in a bar format for easier visual comparison.

- **① Latency Difference:** For example, the chart above shows the response latency metrics of access data at each observation point. The differences between bars clearly indicate a significant latency bottleneck from the `Client Container Node` to the `Server Container Node` compared to other points.

![Physical Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fb6e1309.png)

When `access data` passes through the `physical network`, it is displayed in a physical topology showing the metric values collected at each physical collection point.

- `Node` data is obtained from the corresponding `network location`. If no data is collected at a location for the current `access data`, it will be shown as empty.

## Application Metrics

Application metrics display aggregated values of application metrics over a period in an overview chart. Multiple line charts can be added to show metric trends over time.

![Application Metrics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab046aa9e5.png)

- **Metric Curve**
  - Metric Name: Click to select the metric line chart to display.
  - Aggregation Function: Supports applying functions to the selected metric.
  - Grouping: Supports grouping the current data. For example, when viewing the response latency of a service, you can further group by `l7_protocol` to see latency per application protocol.
  - Enable/Disable Tip Sync: When enabled, view metric values at the same time point across all line charts.
- Click the time component in the upper right to filter data by time.

## Endpoint List

The endpoint list displays metrics grouped by `endpoint`.

![Endpoint List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445f9f99c90.png)

- Click a table row to enter the `Call Logs` page for that `endpoint`. For details, see the **Call Logs** section.
- Click the time component in the upper right to filter data by time.

## Call Logs

Call logs display detailed call log data for the clicked item in both trend analysis chart and table formats.

![Call Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab2c948e98.png)

- Trend Analysis Chart: Shows log collection over a time range. Users can select any time segment to zoom in and view logs for that period.
- Log Detail Table: Displays log information such as client, server, application protocol, request type, request domain, etc., and dynamically updates based on the trend chart. For details, see **[Table](../dashboard/panel/table/)**.
  - Click a table row to enter the log detail page. For details, see **Call Log Details**.
- Click the icon in the upper right of the trend chart to open the `Call Logs` page in a new tab for custom searches.
- Click the time component in the upper right to filter data by time.

## Call Log Details

The call log details page shows response latency, application protocol, request type, request resource, and response status between the client and server at the top. Below the basic information are two buttons with different actions depending on the log source. Below the buttons are the Tags and Metrics for the log, displayed as key-value pairs for quick reference.

![Call Log Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab59c80b81.png)

- Action Buttons:
  - View Flow Logs: Available only for logs with `Packet` as the signal source. For details, see **Flow Log Details**.
  - Distributed Tracing: Available for logs with `eBPF` or `OTel` as the signal source. For details, see **[Distributed Tracing](../dashboard/panel/flame/)**.
- For tag search, filtering, and other `operations`, see **Knowledge Graph**.

## Network Metrics

Network metrics display aggregated values over a period and show trends in a line chart.

![Network Metrics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab47494a85.png)

- Metric Name: Click to select the metric line chart to display.
- Aggregation Function: Supports applying functions to the selected metric.
- Grouping: Supports grouping the current data. For example, when viewing the traffic size of a cloud server, you can further group by `server_port` to see traffic per port.
- Enable/Disable Tip Sync: When enabled, view metric values at the same time point.
- For details on using line charts, see **[Line Chart](../dashboard/panel/line/)**.
- Click the time component in the upper right to filter data by time.

## Flow Logs

Flow logs record detailed information for each flow at a one-minute granularity, displayed in both trend analysis chart and table formats.

![Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cbef482a14.png)

- Trend Analysis Chart: Shows flow log collection over a time range. Users can select any time segment to zoom in and view logs for that period.
- Log Detail Table: Displays flow log information such as client, server, application protocol, request type, request domain, etc., and dynamically updates based on the trend chart. For details, see **[Table](../dashboard/panel/table/)**.
  - Left Quick Filter: Filter flow logs using the left sidebar. For details, see **[Left Quick Filter](../query/left-quick-filter/)**.
  - Click a table row to enter the log detail page. For details, see **Flow Log Details**.
- Click the icon in the upper right of the trend chart to open the `Flow Logs` page in a new tab.
- Click the time component in the upper right to filter data by time.

## Flow Log Details

Flow log details provide further information. For `TCP` protocol logs, TCP sequence diagram tracing and NAT tracing are available.

![Flow Log Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cf395cfbd9.png)

- Action Buttons:
  - TCP Sequence Diagram: Displays detailed information for each TCP packet header, showing the process of connection establishment, data transfer, and connection closure. For details, see **TCP Sequence Diagram Analysis**.
  - NAT Tracing: Initiates tracing using a `five-tuple`. For details, see **NAT Tracing Details**.
  - PCAP Download: If a matching PCAP policy exists, download is available.
  - Call Logs: Displays current call log information (see below **14 - Call Logs**).
- For `operations`, see **Knowledge Graph**.

![Call Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cf4122132c.png)

- Consists of a call trend analysis chart and call log table.
  - Trend Analysis Chart: Shows the number of requests over a time range.
  - Call Log Table: Displays detailed call log information. Click a row to enter the `Call Log Details` page.

## TCP Sequence Diagram

The TCP sequence diagram displays detailed information for each TCP packet header in both trend analysis chart and table formats, including timestamps, direction, flags, Seq, Ack, etc., during connection establishment, data transfer, and connection closure, for deeper network communication analysis and troubleshooting.

![17-TCP Sequence Diagram](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aba4f61574.png)

- Click the time component in the upper right to filter data by time.
- Sequence Table:
  - Time, Seq, and Ack can be toggled between relative and absolute values via the list header buttons.
  - Interval time is the difference between the current and previous row.
  - PCAP Download: If the current flow matches a PCAP policy, the PCAP file can be downloaded.

## NAT Tracing

NAT tracing can initiate tracing for any TCP four-tuple or five-tuple, using DeepFlow’s proprietary algorithm to automatically trace traffic before and after NAT. The NAT tracing page displays metrics for the four-tuple in a table. Clicking `Trace` initiates tracing.

![NAT Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab59bad70a.png)

- Click a table row to trace the data. For details, see **NAT Tracing Details**.
- Click the icon in the upper right to open the `NAT Tracing` page in a new tab for custom searches.
- Click the time component in the upper right to filter data by time.

## NAT Tracing Details

NAT tracing details are divided into three parts: the header with information about the traced flow, the left side showing the traced network topology (virtual and physical), and the right side showing the corresponding traffic topology.

![NAT Tracing Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aba4daabc0.png)

- Traffic Topology: Displays all traced traffic in a `free topology`. Click a `line` to view detailed path information.
- Network Topology: Displays observation points of the traced traffic in a `waterfall topology`.
  - Virtual Network Topology: Shows observation points in the virtual network, such as client NIC, client container node, server container node, server NIC.
  - Physical Network Topology: Shows network locations in the physical network.
    - Note: Only displayed if the traced traffic passes through the physical network.
  - Operations:
    - Hover over `nodes` and `lines` to view detailed information, including observation point, network location, tunnel info, and metrics.
- Action Buttons:
  - Change Metrics: Switch the queried metrics.
  - Show/Hide Delta: Show or hide the difference in primary metrics between adjacent nodes in the `network topology`.
  - Show/Hide Full Names: Show or hide full node names in the topology.
  - Settings:
    - Add to Dashboard: Add the Panel to a Dashboard.
    - View API: Basic Panel operation. See **[Traffic Topology - Settings](../dashboard/panel/topology/)**.
    - Toggle Thumbnail: Show/hide the thumbnail in the lower left of the topology.
    - Matching Algorithm Degree: Adjust NAT tracing algorithm parameters.
- Click the time component in the upper left to filter data by time.

## Resource Change Events

Displays resource change events for the clicked data object in both trend analysis chart and table formats.

![Resource Change Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fa11ff96.png)

## File Read/Write Events

Displays file read/write events for the clicked data object in both trend analysis chart and table formats.

![File Read/Write Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fa2b14d2.png)