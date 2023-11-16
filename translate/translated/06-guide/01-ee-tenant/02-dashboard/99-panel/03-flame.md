---
title: Distributed Tracing
permalink: /guide/ee-tenant/dashboard/panel/flame/
---

> This document was translated by GPT-4

# Distributed Tracing

DeepFlow utilizes `distributed tracing` to depict all applications, system, and network spans involved in a call on a single flame graph. By doing so, it truly facilitates collaboration among different teams such as business development teams, framework development teams, service mesh operations teams, container operations teams, DBA teams, and cloud operations teams on one platform.

## Overview

This feature allows you to initiate `tracing` for a call, which is then presented in a right-side panel. It provides a visual representation of the trace and the following image gives an idea of how it looks.

```
Note: Adding the flame graph and topology graph of distributed tracing to the view is not currently supported.
```

![3_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309196509588519859.png)

The tracing panel is divided into three sections: Header Information, Data Visualization, and Call Information Data List.

- **① Header Information:** Displays the basic information about the trace, such as client, server, request start time, duration, request type, requested resources, and so on.
- **① Data Visualization:** The tracing span data are displayed as a flame graph, or the tracing services are shown as a topology graph.
- **② Call Information Data List:** Shows the details of each call in the data list.

### Flame Graph

![3_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095885c540d.png)

The flame graph is composed of several bar `Spans`, and each bar represents a Span. The x-axis denotes time, while the y-axis signifies the depth of the call stack. The Spans are displayed in the order in which they are invoked.

- **Length:** In conjunction with the x-axis, it represents the duration of a span.
- **Service List:** Shows the latency proportion of each service, clicking on the service will link to the corresponding Spans in the `flame graph`.
  - **Color:** A unique color is assigned to each service; all network Spans are marked in gray as they do not belong to any service.
- **Display Information:** Each bar's display information comprises of `Icon` + `Call Information` + `Execution Time`.
  - Icon: A distinct icon to differentiate the types of Span.
    - A: Application Span, collected by the Opentelemetry protocol, covering business and framework code.
    - S: System Span, collected intrusively by eBPF, covering system calls, application functions (like HTTPS), API Gateway, service mesh sidecar, etc.
    - N: Network Span, collected by BPF from network traffic, covering iptables, ipvs, OvS, LinuxBridge, and other container network components
  - Call Information: Slightly differs for various spaces.
    - Application and System Span: `Application Protocol`, `Request Type`, `Requested Resources`.
    - Network Span: `Routing statistical position`.
  - Execution Time: The total time consumed from the beginning to the end of a Span.
- **Actions:** Supports `Hover` and `Click`.
  - Hover: Hovering over a Span displays call information, instance information, and execution time in a tooltip.
    - Instance Information: For Application Spann shows `Service` + `Resource Instance`; for System Span shows `Process` + `Resource Instance`; for Network Span shows `Interface` + `Resource Instance`.
    - Execution Time: Displays the proportion of time consumed by a Span.
  - Click: Clicking on a Span highlights itself and its parent Span and lets you inspect detailed information of the clicked Span.
- **Collapse Sidebar:** Allows collapsing the `Service List`.

### Call Topology Maps

![3_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091965095886aa8de.png)

The topology map organizes the data structure and presents the data with services grouped as nodes. The parent-child relationships between the spans are represented as horizontal and vertical connections between the nodes, demonstrating the request call relationships.

- **Node:** Corresponds to the services in the flame graph's service list. Several Spans under the same service are consolidated into a single node, displaying the overall time consumption of the service in the call chain.
  - Display Information: The square node's display information includes `Icon`, `Call Information` and `Self-consumed Time`.
    - Icon: Icons are used for distinguishing different types of Span, for more details refer to the 'Flame Graph' section.
  - Self-consumed Time: The total time consumption for all Spans corresponding to the service.
- **Path:** Each path outlines the parent-child relationship between Spans, as represented in the flame graph.
- **Actions:** Supports `Hovering` and `Clicking`, for more details refer to the 'Flame Graph' section.
