---
title: Right Sliding Box
permalink: /guide/ee-tenant/tracing/right-sliding-box/
---

> This document was translated by ChatGPT

# Right Sliding Box

Clicking on table rows, line chart legends, topology diagrams, and other elements on the feature page can bring up the right sliding box, which will display detailed information about the clicked data. The right sliding box offers various functionalities including knowledge graph, traffic relationships, application metrics, endpoint list, call logs, distributed tracing, network metrics, network path, flow logs, NAT tracing, events, etc., to meet different user needs. Users can select the appropriate functionality based on actual needs to view and analyze data, quickly identify and address issues, and improve work efficiency.

Next, we will introduce each feature in detail.

## Knowledge Graph

The knowledge graph displays all tags associated with the clicked data object in both list and topology forms.

![Knowledge Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab0460298a.png)

- **Knowledge List**: Displays all tags associated with the clicked data object in key-value pairs, categorized into `Universal Tag`, `Custom Tag`, and `others`.
  - Note: If the clicked data is from the `call series page`, the categories will be distinguished between Client and Server.
  - Operations: Supports searching, category filtering, and empty value filtering for key-value pairs.
    - Search: Supports quick search within `Select All` data.
    - Left-side category filtering: Check the categories to display the corresponding content quickly.
    - Show/Hide empty tags: Display or hide tags with data value `--`.
    - Hover over the tag and click the `copy` icon to quickly copy.
      - Paste the copied content into the search bar, which can convert it into a search tag. For details on using search tags, refer to the [Service Search Box](../query/service-search/) section.
- **Knowledge Graph**: Displays the relationships of tags in a star topology structure. Clicking on a node will display associated nodes.

## Traffic Relationships

The upper part of the traffic relationships displays upstream and downstream metrics of the clicked data object in a table. Clicking on a table row will use DeepFlow's self-developed flow tracing algorithm to trace the `access data` through observation points in the virtual or physical network.

![Traffic Relationships](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fad66aac.png)

- **① Dropdown Box:** Click the dropdown box to select the object to view traffic relationships. If the clicked data is from the `path data page`, there will be two objects.
- **② Role:** Check `as client` or `as server` to select the metrics when the current object acts as a `client` or `server`.

![Virtual-Link Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fae1d9bb.png)

The link topology is sorted from left to right according to the observation points the `access data` flows through, such as client application -> client process -> client network card -> ... -> server network card -> server process -> server application.

- Note: Each `node` on the topology represents aggregated information from the same observation point.
- Hover: View metric information.

![Virtual-Detail Table](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fafcb207.png)

The detail table displays detailed information of each observation point for the `access data`, including resource belonging to the observation point, data collection location, tunnel information, and metric details.

- Clicking on a row will display detailed information of the clicked observation point in the right sliding box.

![Virtual-Bar Chart](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664460986c6da.png)

The bar chart displays data consistent with the link topology, providing a more intuitive comparison of data sizes by switching the topology display to a bar chart.

- **① Latency Difference:** For example, the above chart shows the response latency metrics of access data at various observation points, where the differences between bars clearly indicate a significant latency bottleneck from the `client container node` to the `server container node` compared to other locations.

![Physical Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fb6e1309.png)

When `access data` flows through the `physical network`, it will display the metrics collected at each physical collection point in a physical topology form.

- The data of `nodes` is obtained from the corresponding `network location`. If no data is collected at the corresponding `network location` for the current `access data`, it will be displayed as empty.

## Application Metrics

Application metrics display the aggregated values of application metrics over a period in an overview chart. It also supports adding multiple line charts to show the trend of application metrics over time.

![Application Metrics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab046aa9e5.png)

- **Metric Curve**
  - Metric Name: Click to select the metric line chart to display.
  - Aggregation Function: Supports function calculations on selected metrics.
  - Grouping: Supports grouping the current data. For example, if viewing the response latency of a service, you can further view the response latency of each application protocol by adding `l7_protocol` as a subgroup.
  - Enable/Disable Tip Sync: When enabled, you can view the metrics at the same time point across all line charts.
- Click the time component in the upper right corner to filter data by time.

## Endpoint List

The endpoint list displays the metrics grouped by `endpoints`.

![Endpoint List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445f9f99c90.png)

- Clicking on a table row will take you to the `call logs` page to view the call log information of that `endpoint`. For details, refer to the [Call Logs] section.
- Click the time component in the upper right corner to filter data by time.

## Call Logs

Call logs display detailed call logs of the clicked data in trend analysis charts and tables.

![Call Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab2c948e98.png)

- Trend Analysis Chart: Displays the log collection situation within a certain time range, visualizing the data. Users can select any time period on the trend analysis chart to zoom in and view the log situation within that period.
- Log Detail Table: Displays log information in a table format, such as client, server, application protocol, request type, request domain, etc. It can dynamically display based on the trend analysis chart. For details, refer to the [Table](../dashboard/panel/table/) section.
  - Clicking on a table row will take you to the detail page of that log. For details, refer to the [Call Log Details] section.
- Click the icon in the upper right corner of the trend analysis chart to open the `call logs` page in a new window for custom searches.
- Click the time component in the upper right corner to filter data by time.

## Call Log Details

Call log details display the response latency, application protocol, request type, request resource, and response status between the client and server of the request data at the top of the page. Below the basic information, two buttons perform different operations based on the source of the log data. Below the buttons, the corresponding tags and metrics of the log are displayed in key-value pairs for quick information retrieval.

![Call Log Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab59c80b81.png)

- Operation Buttons:
  - View Flow Logs: Only for logs with the signal source as `Packet`, view detailed flow log information. For details, refer to the [Flow Log Details] section.
  - Distributed Tracing: Supports initiating distributed tracing for logs with the signal source as `eBPF` or `OTel`. For details, refer to the [Distributed Tracing](../dashboard/panel/flame/) section.
- For tag search, filtering, and other `operations`, refer to the [Knowledge Graph] section.

## Network Metrics

Network metrics display the aggregated values of network metrics over a period and show the trend of network metrics over time in line charts.

![Network Metrics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab47494a85.png)

- Metric Name: Click to select the metric line chart to display.
- Aggregation Function: Supports function calculations on selected metrics.
- Grouping: Supports grouping the current data. For example, if viewing the traffic size of a cloud server, you can further view the traffic size of each port of the cloud server by adding `server_port` as a subgroup.
- Enable/Disable Tip Sync: When enabled, you can view the metrics at the same time point across all line charts.
- For details on using line charts, refer to the [Line Chart](../dashboard/panel/line/) section.
- Click the time component in the upper right corner to filter data by time.

## Flow Logs

Flow logs record detailed information of each flow at a minute granularity and display the clicked data's flow logs in trend analysis charts and tables.

![Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cbef482a14.png)

- Trend Analysis Chart: Displays the flow log collection situation within a certain time range, visualizing the data. Users can select any time period on the trend analysis chart to zoom in and view the log situation within that period.
- Log Detail Table: Displays flow log information in a table format, such as client, server, application protocol, request type, request domain, etc. It can dynamically display based on the trend analysis chart. For details, refer to the [Table](../dashboard/panel/table/) section.
  - Left-side Quick Filter: Allows filtering flow logs by conditions through the left sidebar. For details, refer to the [Left-side Quick Filter](../query/left-quick-filter/) section.
  - Clicking on a table row will take you to the detail page of that log. For details, refer to the [Flow Log Details] section.
- Click the icon in the upper right corner of the trend analysis chart to open the `flow logs` page in a new window.
- Click the time component in the upper right corner to filter data by time.

## Flow Log Details

Flow log details further display the information of flow logs. For logs with the protocol as `TCP`, TCP sequence tracing and NAT tracing can be performed.

![Flow Log Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cf395cfbd9.png)

- Operation Buttons:
  - TCP Sequence Diagram: Displays detailed information of each TCP packet header, clearly showing the process of TCP connection establishment, data transmission, and connection closure. For details, refer to the [TCP Sequence Diagram Analysis] section.
  - NAT Tracing: Initiates tracing using the `five-tuple`. For details, refer to the [NAT Tracing Details] section.
  - PCAP Download: If there is a matching PCAP policy for the current data, it can be downloaded.
  - Call Logs: Displays the current call log information. See the figure below for [14-Call Logs].
- For `operations`, refer to the [Knowledge Graph] section.

![Call Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660cf4122132c.png)

- Consists of a call trend analysis chart and a call log table.
  - Trend Analysis Chart: Displays the number of request calls within a certain time period.
  - Call Log Table: Displays detailed information of the call logs. Clicking on a table row will take you to the `call log details` page for more information.

## TCP Sequence Diagram

The TCP sequence diagram displays detailed information of each TCP packet header in trend analysis charts and tables, including timestamps, direction, Flag, Seq, Ack, etc., during the TCP connection establishment, data transmission, and connection closure processes, for further analysis and diagnosis of network communication issues.

![17-TCP Sequence Diagram](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aba4f61574.png)

- Click the time component in the upper right corner to filter data by time.
- Sequence Table
  - Time, Seq, and Ack can be toggled between relative and absolute values by clicking the buttons in the list header.
  - Interval time is the time difference between the current row and the previous row.
  - PCAP Download: If the current flow matches the PCAP policy, the PCAP file can be downloaded.

## NAT Tracing

NAT tracing can initiate tracing for any TCP four-tuple or five-tuple, using DeepFlow's self-developed algorithm to automatically trace the traffic before and after NAT. The NAT tracing page displays the metrics corresponding to the clicked data's four-tuple in a table. Clicking `trace` will initiate tracing for the four-tuple.

![NAT Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ab59bad70a.png)

- Clicking on a table row will initiate tracing for that data. For details, refer to the [NAT Tracing Details] section.
- Click the icon in the upper right corner to open the `NAT tracing` page in a new window for custom searches.
- Click the time component in the upper right corner to filter data by time.

## NAT Tracing Details

NAT tracing details are divided into three main parts: the top header displays related information of the initiated tracing flow; the left side shows the traced network topology, consisting of virtual network topology and physical network topology; the right side shows the corresponding traffic topology.

![NAT Tracing Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aba4daabc0.png)

- Traffic Topology: Displays all traced traffic in a `free topology` form. Clicking on a `line` will show detailed information of the corresponding path.
- Network Topology: Displays the observation points of the traced traffic in a `waterfall topology` form.
  - Virtual Network Topology: Displays the observation points the traced traffic passes through in the virtual network, such as client network card, client container node, server container node, server network card.
  - Physical Network Topology: Displays the network locations the traced traffic passes through in the physical network.
    - Note: Physical network topology is displayed only if the traced traffic passes through the physical network.
  - Operations:
    - Supports hovering over `nodes` and `lines` to view more detailed information, including observation points, detailed information of network locations, tunnel information, and metrics.
- Operation Buttons:
  - Modify Metrics: Supports switching metric queries.
  - Show/Hide Difference: Displays or hides the main metric difference between adjacent nodes in the `network topology`.
  - Show/Hide Full Name: Displays or hides the full name of `nodes` in the topology.
  - Settings:
    - Add to Dashboard: Supports adding the panel to the dashboard.
    - View API: Basic operations of the panel, refer to the [Traffic Topology - Settings](../dashboard/panel/topology/) section.
    - Close Thumbnail: Enable/disable the thumbnail in the lower left corner of the topology.
    - Matching Algorithm Degree: Supports adjusting the parameters of the NAT tracing algorithm.
- Click the time component in the upper left corner to filter data by time.

## Resource Change Events

Displays resource change events of the clicked data object in trend analysis charts and tables.

![Resource Change Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fa11ff96.png)

## File Read/Write Events

Displays file read/write events of the clicked data object in trend analysis charts and tables.

![File Read/Write Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566445fa2b14d2.png)