---
title: Distributed Tracing
permalink: /guide/ee-tenant/dashboard/panel/flame/
---

> This document was translated by ChatGPT

# Distributed Tracing

DeepFlow presents application Spans, system Spans, and network Spans involved in a single call on a flame graph through `distributed tracing`, enabling collaboration across business development teams, framework development teams, service mesh operations teams, container operations teams, DBA teams, and cloud operations teams on a single platform.

## Overview

Initiate a `tracing` operation on a call in the `distributed tracing` feature page, and then display it in the form of a right slide-out panel. This diagram shows the link call tracing display method, as shown below.

```
Note: The flame graph and topology graph of distributed tracing currently do not support adding to the Dashboard.
```

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466431461b3f38.png)

The right slide-out panel for call tracing is divided into three parts: header information, data visualization, and call information data list.

- **① Header Information:** Displays basic information about the link, such as client, server, request start time, duration, request type, request resource, etc.
- **① Data Visualization:** Displays call tracing Span data in the form of a flame graph or the service of call tracing in the form of a topology graph.
- **② Call Information Data List:** Displays related information of the call.

### Flame Graph

![01-Flame Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095885c540d.png)

The flame graph consists of multiple `bar segments`, each representing a Span. The x-axis represents time, and the y-axis represents the depth of the call stack, displayed from top to bottom in the order of Span calls. Below is a detailed introduction:

- **Length:** Combined with the x-axis, it represents the execution time of a Span, with both ends corresponding to the start and end times.
- **Service List:** Displays the time consumption ratio of each service. Clicking on a service can link with the `flame graph` to highlight the corresponding Span of the service.
  - **Color:** Application Spans and system Spans each represent a color for a service; all network Spans are gray (as network Spans do not belong to any service).
- **Display Information:** The `display information` of the bar segment consists of `icon` + `call information` + `execution time`.
  - Icon: Different types of Spans are distinguished by icons.
    - A: Application Span, collected through the Opentelemetry protocol, covering business code and framework code.
    - S: System Span, collected through eBPF with zero intrusion, covering system calls, application functions (such as HTTPS), API Gateway, service mesh Sidecar.
    - N: Network Span, collected from network traffic through BPF, covering container network components such as iptables, ipvs, OvS, LinuxBridge.
  - Call Information: The `call information` displayed by different Spans varies.
    - Application Span and System Span: `Application Protocol`, `Request Type`, `Request Resource`.
    - Network Span: `Observation Point`.
  - Execution Time: The total time consumed from the start to the end of the Span.
- **Operation:** Supports `hover` and `click`.
  - Hover: Hover over a Span to display `call information` + `instance information` + `execution time` in the form of a TIP.
    - Instance Information: Application Span displays `service` + `resource instance`; System Span displays `process` + `resource instance`; Network Span displays `network card` + `resource instance`.
    - Execution Time: Displays the entire execution time of the Span, i.e., the proportion of its own execution time.
  - Click: Click on a Span to highlight itself and its parent Span, and view detailed information of the clicked Span.
- **Collapse Sidebar:** Click to collapse the `service list`.

### Call Topology Graph

![02-Call Topology Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095886aa8de.png)

The call topology graph displays data in an orderly and structured manner, with data aggregated by service as nodes. The parent-child relationship between Spans is displayed using horizontal and vertical lines between nodes, showing their request call relationships. Below is a detailed introduction:

- **Node:** Corresponds to the service in the service list of the flame graph, aggregating one or more Spans under the same service into a node, and displaying the time consumed by the service in the call chain.
  - Display Information: The square node `display information` consists of `icon` + `call information` + `self time`.
    - Icon: Different types of Spans are distinguished by icons. For details, please refer to the [Flame Graph] section.
  - Self Time: The total time consumed by one or more Spans corresponding to the service.
- **Path:** Draws the topology path corresponding to the `parent Span` to `child Span` relationship in the flame graph.
- **Operation:** Supports `hover` and `click`. For details, please refer to the [Flame Graph] section.

### Bottom Tab

#### Call Details

Displays detailed information of Spans in the flame graph in the form of a list. Clicking on a Span in the flame graph will highlight the corresponding call details in the list; conversely, clicking on a row in the list will highlight the corresponding Span.

![Call Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145809589.png)

#### IO Events

When clicking on a system Span in the flame graph, if the system Span corresponds to a process with IO read/write events, the corresponding IO events can be viewed. The IO events Tab allows for quick viewing of the time consumed by Span for file read/write.

![IO Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145f4f784.png)

**① First Row:** Overlays the IO event blocks of all threads below, the more overlap, the darker the color.
**② Thread Row:** Displays the IO events of each thread, with each block corresponding to an event. The length of the block is calculated based on the start and end times of the IO event.

- Tip: Consists of `file name` + `IO event type` + `event duration`.
  **③ Detailed Information:** Displays details of the IO event.

#### Flow Logs

When clicking on a network Span in the flame graph, analyze the latency data of the flow logs corresponding to the time period of the call logs.

![Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145d06086.png)

**① Status Row:** Determines the observation point, flow duration, and flow log status.
**② Latency:** Analyzes network-related latency, including TCP connection latency, TLS connection latency, average data latency, average system latency, and average client wait latency. The calculation method of latency can be referred to in the `Metric Diagram`.

#### Span Tracing

When analyzing why a Span exists in the flame graph, the Span tracing function can be used. Clicking on a Span in the flame graph displays the relationship with other Spans in the form of a list. DeepFlow's distributed tracing is calculated based on a series of IDs, including TraceID, SpanID, ParentSpanID, request X-Request-ID, response X-Request-ID, request Syscall TraceID, response Syscall TraceID, request TCP Seq number, response TCP Seq number. When there is an association between IDs, the Spans can be displayed in association on a single flame graph, with the association of IDs marked in purple in the list.

![Span Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466431459e1b6e.png)

**① Clicked Span:** The Span clicked in the flame graph.
**① Associated Span:** The Span associated with the clicked Span.

### Quick Understanding of Flame Graph

![Flame Graph Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d2abc86b21.png)

The flame graph represents the passage of time from left to right. In the sample call chain above, the complete processing of a business request goes through the following process:

- (1) The "Client" process initiates an HTTP GET request, which is transmitted through multiple network cards to the "Frontend Service".
- (2) The "Frontend Service", to complete this business process, first initiates a DNS query to the "DNS Service", which is transmitted through the network to the "DNS Service".
- (3) The "DNS Service" processes the query and returns a DNS response to the "Frontend Service", which is transmitted through the network to the "Frontend Service".
- (4) The "Frontend Service" continues to initiate an SQL query, which is transmitted through the network to the "MySQL Service".
- (5) The "MySQL Service" processes the query and returns an SQL response to the "Frontend Service", which is transmitted through the network to the "Frontend Service".
- (6) The "Frontend Service" continues to initiate an RPC request, which is transmitted through the network to the "RPC Service".
- (7) The "RPC Service" processes the request and returns an RPC response, which is transmitted through the network to the "Frontend Service".
- (8) The "Frontend Service" receives the RPC response and replies with the final HTTP response to the "Client", which is transmitted through the network to the "Client".

The difference in length between any two Spans represents the amount of latency introduced between the two points.

### Flame Graph Analysis Examples

- **Example 1: Significant Difference Between Network Spans**

In the figure below, the significant difference between two network Spans indicates a noticeable delay in the transmission of call data packets between two network cards. If the two network cards are "client container node" and "server container node", it indicates that the root cause of the slow response is the forwarding network between the container nodes.

![Slow Call Flame Graph Example 1 - Significant Difference Between Network Spans](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d2926ceffc.png)

- **Example 2: Significant Difference Between System Spans**

In the figure below, the significant difference between two system Spans of the "Frontend Service" indicates that the root cause of the slow response lies in the processing of the "Frontend Service" process.

![Slow Call Flame Graph Example 2 - Significant Difference Between System Spans](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d292867f8b.png)

- **Example 3: Significant Length of Terminal System Span**

In the figure below, the significant length of the "DNS Service" indicates that the root cause of the slow response lies in the processing of the "DNS Service" process.

![Slow Call Flame Graph Example 3 - Significant Length of Terminal System Span](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d292a82a96.png)
