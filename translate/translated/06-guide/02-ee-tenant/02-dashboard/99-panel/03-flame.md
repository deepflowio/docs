---
title: Distributed Tracing
permalink: /guide/ee-tenant/dashboard/panel/flame/
---

> This document was translated by ChatGPT

# Distributed Tracing

DeepFlow uses `distributed tracing` to present all application Spans, system Spans, and network Spans involved in a single call in one flame graph, enabling true cross-team collaboration among business development teams, framework development teams, service mesh operations teams, container operations teams, DBA teams, and cloud operations teams on a single platform.

## Overview

On the `distributed tracing` page, initiate a `tracing` operation for a call, which will then be displayed in a right-side sliding panel. This panel shows the call tracing visualization, as illustrated below.

```
Note: Flame graphs and topology graphs in distributed tracing currently do not support being added to a Dashboard
```

![00-Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466431461b3f38.png)

The right-side tracing panel is divided into three parts: header information, data visualization, and call information data list.

- **① Header Information:** Displays basic information about the trace, such as client, server, request start time, duration, request type, request resource, etc.
- **① Data Visualization:** Displays tracing Span data as a flame graph or shows traced services as a topology graph.
- **② Call Information Data List:** Displays related call information.

### Flame Graph

![01-Flame Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095885c540d.png)

A flame graph consists of multiple `bar-shaped` blocks, each representing a Span. The x-axis represents time, and the y-axis represents call stack depth. Spans are displayed from top to bottom in the order they are called. Details are as follows:

- **Length:** Along the x-axis, represents the execution time of a Span, with each end corresponding to the start and end times.
- **Service List:** Shows the proportion of latency consumed by each service. Clicking a service will highlight the corresponding Spans in the `flame graph`.
  - **Color:** Application Spans and system Spans use a unique color for each service; all network Spans are gray (as they do not belong to any service).
- **Display Information:** Each bar’s `display information` consists of an `icon` + `call information` + `execution time`.
  - Icon: Differentiates Span types:
    - A: Application Span, collected via the OpenTelemetry protocol, covering business code and framework code.
    - S: System Span, collected via eBPF with zero intrusion, covering system calls, application functions (e.g., HTTPS), API Gateway, and service mesh Sidecar.
    - N: Network Span, collected from network traffic via BPF, covering container network components such as iptables, ipvs, OvS, and LinuxBridge.
  - Call Information: Varies by Span type:
    - Application Span and System Span: `Application protocol`, `Request type`, `Request resource`
    - Network Span: `Observation point`
  - Execution Time: Total time consumed from Span start to end.
- **Operations:** Supports `hover` and `click`.
  - Hover: Displays `call information` + `instance information` + `execution time` in a tooltip.
    - Instance Information: Application Span shows `service` + `resource instance`; System Span shows `process` + `resource instance`; Network Span shows `network interface` + `resource instance`.
    - Execution Time: Shows the total execution time of the Span and its proportion of self-execution time.
  - Click: Highlights the Span and its parent Span, and allows viewing detailed information of the clicked Span.
- **Collapse Sidebar:** Allows collapsing the `service list`.

### Call Topology Graph

![02-Call Topology Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095886aa8de.png)

The call topology graph presents data in an orderly, structured way. Data is aggregated by service into nodes, and horizontal/vertical lines between nodes represent parent-child relationships between Spans, showing the request call relationships. Details are as follows:

- **Node:** Corresponds to a service in the flame graph’s service list, aggregating one or more Spans under the same service into a single node, and showing the total time consumed by that service in the trace.
  - Display Information: Square node `display information` consists of `icon` + `call information` + `self time`.
    - Icon: Differentiates Span types; see the Flame Graph section for details.
  - Self Time: The total time consumed by one or more Spans corresponding to the service.
- **Path:** Draws topology paths corresponding to the `parent Span` to `child Span` relationships in the flame graph.
- **Operations:** Supports `hover` and `click`; see the Flame Graph section for details.

### Bottom Tabs

#### Call Details

Displays detailed information of Spans in the flame graph in a list format. Clicking a Span in the flame graph highlights the corresponding call detail in the list, and vice versa.

![Call Details](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145809589.png)

#### IO Events

When clicking a system Span in the flame graph, if the corresponding process has IO read/write events, you can view them. The IO Events tab allows quick viewing of the time consumed by file read/write operations for the Span.

![IO Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145f4f784.png)

**① First Row:** Overlays IO event blocks from all threads below; the more overlap, the darker the color.  
**② Thread Row:** Shows IO events for each thread, with each block representing an event. Block length is calculated from the IO event’s start and end times.

- Tip: Consists of `file name` + `IO event type` + `event duration`  
  **③ Detailed Information:** Shows details of the IO event.

#### Flow Logs

When clicking a network Span in the flame graph, analyzes latency data from flow logs corresponding to the call log’s time range.

![Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146643145d06086.png)

**① Status Row:** Determines observation point, flow duration, and flow log status.  
**② Latency:** Analyzes network-related latencies, including TCP connection latency, TLS connection latency, average data latency, average system latency, and average client wait latency. For latency calculation methods, see the `metrics diagram`.

#### Span Tracing Source

When analyzing why a Span exists in the flame graph, you can use the Span tracing source feature. Clicking a Span in the flame graph displays its relationships with other Spans in a list. DeepFlow’s distributed tracing is computed based on a series of IDs, including TraceID, SpanID, ParentSpanID, request X-Request-ID, response X-Request-ID, request Syscall TraceID, response Syscall TraceID, request TCP Seq number, and response TCP Seq number. When IDs are related, Spans can be linked and displayed in the same flame graph. Related IDs are marked in purple in the list.

![Span Tracing Source](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051466431459e1b6e.png)

**① Clicked Span:** The Span clicked in the flame graph.  
**① Related Span:** Spans related to the clicked Span.

### Quick Understanding of Flame Graphs

![Flame Graph Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d2abc86b21.png)

A flame graph represents the passage of time from left to right. In the example trace above, a complete business request is processed as follows:

- (1) The "Client" process initiates an HTTP GET request, which is transmitted through multiple network interfaces to the "Frontend Service".
- (2) The "Frontend Service", to complete the business process, first sends a DNS query to the "DNS Service", which is transmitted over the network to the "DNS Service".
- (3) The "DNS Service" processes the query and returns a DNS response to the "Frontend Service", transmitted over the network.
- (4) The "Frontend Service" then sends an SQL query, transmitted over the network to the "MySQL Service".
- (5) The "MySQL Service" processes the query and returns an SQL response to the "Frontend Service", transmitted over the network.
- (6) The "Frontend Service" then sends an RPC request, transmitted over the network to the "RPC Service".
- (7) The "RPC Service" processes the request and returns an RPC response to the "Frontend Service", transmitted over the network.
- (8) After receiving the RPC response, the "Frontend Service" sends the final HTTP response to the "Client", transmitted over the network to the "Client".

The difference in length between any two Spans represents the latency introduced between those two points.

### Flame Graph Analysis Examples

- **Example 1: Significant Difference Between Network Spans**

In the figure below, the significant difference between two network Spans indicates noticeable latency in packet transmission between two network interfaces. If the two interfaces belong to the "Client container node" and the "Server container node", the root cause of the slow response is the forwarding network between the container nodes.

![Slow Call Flame Graph Example 1 - Significant Network Span Difference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d2926ceffc.png)

- **Example 2: Significant Difference Between System Spans**

In the figure below, the significant difference between two system Spans in the "Frontend Service" indicates that the root cause of the slow response lies in the "Frontend Service" process handling.

![Slow Call Flame Graph Example 2 - Significant System Span Difference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d292867f8b.png)

- **Example 3: Noticeably Long Terminal System Span**

In the figure below, the noticeably long Span in the "DNS Service" indicates that the slow response originates from the "DNS Service" process handling.

![Slow Call Flame Graph Example 3 - Long Terminal System Span](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240403660d292a82a96.png)