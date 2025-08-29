---
title: DeepFlow 5W Fault Diagnosis Method
permalink: /guide/quick-start/5w-method/
---

> This document was translated by ChatGPT

# Overview

## Unified Observability Data Lake

The DeepFlow observability platform aggregates massive amounts of observability data such as metrics, tracing, logging, profiling, and events through eBPF collection and open data interfaces.

With its AutoTagging label injection technology, DeepFlow can enrich all observability data with detailed text-based labels, including resource tags, business tags, and more — for example, cloud resource information of application instances, container resource information, developer/maintainer/version/commit_id/repository address from CI/CD pipelines, etc. With these labels, you can retrieve all metrics, tracing, logging, profiling, and events related to a specific business or application in one search, display them on a single dashboard, and reach a fault diagnosis conclusion in 3–5 steps of data analysis.

![Unified Observability Data Lake](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3281c6db18.jpeg)

## Unified Collaboration Across Teams

In typical IT system operations, business deployments span multiple availability zones, with complex architectures and numerous components. Operations assurance and fault diagnosis require extensive cross-team communication and collaboration between application, PaaS platform, IaaS cloud, and network teams. The DeepFlow observability platform breaks down data silos, builds data correlations, and provides unified observability and collaboration capabilities for application, PaaS, IaaS, and network operations teams.

![Unified Collaboration Across Teams](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0683ed7b.jpeg)

## 5W Structured Fault Diagnosis

![“5W Fault Diagnosis Method”](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024091466e55024e7297.jpeg)

What is the “**5W Fault Diagnosis Method**”?

In the DeepFlow observability platform, observability data is reviewed in an orderly manner from macro to micro, progressively answering the following five questions to quickly and effectively identify the root cause of a problem — this is called the “**5W Fault Diagnosis Method**”:

- **Who** is in trouble?
- **When** is it in trouble?
- **Which** request is in trouble?
- **Where** is the root position?
- **What** is the root cause?

![5W Fault Diagnosis Process from the Application Perspective](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0696e08d.jpeg)

# Who & When?

In the DeepFlow platform, either through automatic monitoring or manual analysis of performance between application services, anomalies in application services are detected, answering the **Who** and **When** questions:

- Which observability object (e.g., a container service, workload, Pod, or a specific path in an IT system) has degraded service quality (errors, slow responses, or timeouts)?
- At what time point or during which time period did the anomaly occur?

## Where to Start

Typically, performance analysis of application services begins from the following entry points:

- `Tracing` - `Resource Analysis`: Entry point for performance metrics analysis of application services (nodes). [Guide link](../ee-tenant/tracing/service-list/)
- `Tracing` - `Path Analysis`: Entry point for performance metrics analysis of application service access paths (edges). [Guide link](../ee-tenant/tracing/service-statistics/)
- `Tracing` - `Topology Analysis`: Entry point for analyzing application service access topology (surfaces). [Guide link](../ee-tenant/tracing/path-topology/)

## How to Start Searching

Commonly, you filter and combine conditions such as namespace (`pod_ns`), container service (`pod_service`), workload (`pod_group`), and application protocol (`l7_protocol`) to observe the performance metrics of the target object.

- Step 1: If you are responsible for an application system deployed in a Kubernetes namespace named “A”, you can use `pod_ns = A` to observe the RED metrics of all application services in that business system.
- Step 2: To further narrow down to a container service named “b” within namespace “A”, add the filter `pod_svc = b`.
- Step 3: To observe only RED metrics for HTTP protocol calls, add the filter `l7_protocol = http`.

## Which Performance Metrics to Analyze

In the DeepFlow platform, **RED** metrics (Rate, Error, Duration) are used as the core indicators for evaluating business/application service quality:

- **Rate** (`Request Rate`) — Number of requests received per unit time, measuring service throughput/load.
- **Error** (`Error Ratio`) — Proportion of requests returning error responses, used to detect service anomalies. Errors are typically categorized into client-side and server-side causes, with server-side errors being the primary focus.
- **Duration** (`Response Latency`) — Time from request to response, used to detect slow responses. Commonly observed statistics include `average response latency`, `P95 response latency`, and `P99 response latency`.

![RED Metrics Observability in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32824d0259.jpeg)

At this point, you can begin your observability-based diagnosis journey with DeepFlow.

Of course, DeepFlow also offers more filtering conditions for flexible use in different scenarios, which you can explore over time.

# Which?

After answering **Who & When**, the next step is to answer **Which** — which specific application call is abnormal?

The DeepFlow platform provides a hidden `right sliding panel` for each observability object. By clicking any object in **metric curves** or **metric statistics lists**, the `right sliding panel` will automatically expand. [Guide link](../ee-tenant/tracing/right-sliding-box/)

The `right sliding panel` offers multiple data observation windows, including `application metrics`, `endpoint list`, `call logs`, and `network metrics`, for analyzing different dimensions of the object. In the `call logs` subpage, you can review all call logs at the anomaly time and filter abnormal calls (errors, slow responses, or timeouts):

![Retrieving Call Logs in the Right Sliding Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282b398ec.jpeg)

# Where?

After answering **Which**, the next step is to perform distributed tracing on the abnormal call to answer **Where** — finding the root position of errors, slow responses, or timeouts via the distributed tracing flame graph.

## What is Distributed Tracing

Based on eBPF technology, DeepFlow innovatively implements zero-intrusion distributed tracing — no need to generate, inject, or propagate TraceIDs to achieve distributed tracing:

- [Feature usage guide link](../ee-tenant/tracing/call-chain-tracing/)
- [Bilibili video — Understand DeepFlow Distributed Tracing Flame Graph in 3 Minutes](https://www.bilibili.com/video/BV1di421k7JE/)
- [Bilibili video — Understand DeepFlow Distributed Tracing Principles in 3 Minutes](https://www.bilibili.com/video/BV1ZC411E7ad/)

![DeepFlow Distributed Tracing Diagram](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282d820d0.jpeg)

## How to Find the Root Position via the Distributed Tracing Flame Graph

We use a simplified application service model to illustrate how to quickly locate the **Root Position** with DeepFlow’s distributed tracing flame graph.

In this scenario, the `Client` sends an `http get` to the `frontend service`, which queries the `DNS service`, accesses the `MySQL database`, makes an `RPC call`, and finally returns an `http response` to the `Client`.

![Simplified Application Service Model](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328390aa62.png)

### Application-Level Issues

**Application Service — Slow IO Thread**

If there is a significant latency difference between the `POD NIC Span` and the `system Span` of the `frontend service`, it indicates that the `http get` experienced queuing delays when moving from the POD NIC queue to the `frontend service` processing queue.

This is often caused by busy IO thread scheduling.

![Flame Graph Example 1 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284a1f3bb.png)

**Application Service — Slow Work Thread**

If there is a significant latency difference between the `system Span` receiving the `http get` and the `system Span` sending the `dns query` in the `frontend service`, it indicates internal processing delays.

This is often caused by busy work thread scheduling.

![Flame Graph Example 2 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284d7fe39.png)

**Middleware — Slow DNS Service Response**

If the `system Span` of the `DNS service` is significantly long, it indicates that the DNS process took too long to query and return the result, directly causing the slow response.

![Flame Graph Example 3 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328508566e.png)

**Middleware — Slow MySQL Service Response**

Similar to DNS, if the `system Span` of the `MySQL service` is significantly long, it indicates that the MySQL process took too long to process and return the result, directly causing the slow response.

![Flame Graph Example 4 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285438f40.png)

**Other Application Service — Slow RPC Service Response**

Similar to DNS, if the `system Span` of the `RPC service` is significantly long, it indicates that the RPC process took too long to process and return the result, directly causing the slow response.

![Flame Graph Example 5 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328575653a.png)

**Client — Slow Process Handling**

If the `http response` from the `frontend service` reaches the `POD NIC Span` of the `Client` but takes a while to reach the `system Span`, it indicates queuing delays from the POD NIC queue to the `Client` process.

![Flame Graph Example 6 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285982a40.png)

### Network-Level Issues

**Network Transmission — Slow TCP Connection Establishment**

If there is a significant latency difference between the `system Span` and the `POD NIC Span` on the `Client` side, it indicates delays before entering the network.

This often occurs when the `Client` uses short TCP connections, requiring a TCP handshake before sending `http get`. Packet loss or delays during the handshake can cause this.

![Flame Graph Example 7 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3283e248cf.png)

**Network Transmission — Slow Intra-Node Transmission on Client Side**

If there is a significant latency difference between the `POD NIC Span` and the `Node NIC Span` on the `Client` side, it indicates delays in virtual network transmission within the client’s container node.

![Flame Graph Example 8 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284069e45.png)

**Network Transmission — Slow Inter-Node Transmission**

If there is a significant latency difference between the `Node NIC Span` of the `Client` and the `Node NIC Span` of the `frontend service`, it indicates delays in network transmission between container nodes.

![Flame Graph Example 9 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284283c8e.png)

**Network Transmission — Slow Intra-Node Transmission on Server Side**

If there is a significant latency difference between the `Node NIC Span` and the `POD NIC Span` of the `frontend service`, it indicates delays in virtual network transmission within the server’s container node.

![Flame Graph Example 10 (Illustration)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328473bf8b.png)

# What?

After answering “**Where is the root position?**” via distributed tracing in DeepFlow, the next step is to perform multi-dimensional data analysis around the **Root Position** to answer “**What**” (**What is the root cause?**):

- If distributed tracing triage locates the issue to a specific application process, proceed to **application diagnosis** to analyze multiple dimensions of data for that application instance and determine the root cause.
- If distributed tracing triage locates the issue to network transmission, proceed to **network diagnosis** to analyze multiple dimensions of network data and determine the root cause.
- If the issue is related to system performance (e.g., CPU usage, system load, network interfaces), proceed to **system diagnosis** to analyze multiple dimensions of OS data and determine the root cause.

## Application Diagnosis

If the **Root Position** is an application instance, you can analyze resource metrics (CPU, memory, disk, etc.), perform OnCPU continuous profiling, OffCPU continuous profiling, memory profiling, application metrics analysis, and application log retrieval in DeepFlow to find the **Root Cause** inside the application.

### Application Instance Resource Metrics Analysis

DeepFlow can integrate and unify observation of compute resource metrics for container Pods/Containers, quickly determining if container resources are the root cause at the anomaly time.

Entry: `Metrics` - `Container`. [Guide link](../ee-tenant/metrics/container/)

**Pod Status List Observation**

![Pod Status Observation Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32862b4f18.jpeg)

**Container Metrics Detail Observation**

![Container Metrics Observation Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328672066c.png)

### OnCPU Continuous Profiling

DeepFlow can continuously profile OnCPU usage to find CPU hotspot functions in application processes.

Entry: `Profiling` - `Continuous Profiling`. [Guide link](../ee-tenant/profiling/continue-profile/)

![OnCPU Continuous Profiling Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3286e73055.png)

### OffCPU Continuous Profiling

DeepFlow can continuously profile OffCPU usage to find blocking functions caused by IO waits, locks, etc.

Entry: `Profiling` - `Continuous Profiling`. [Guide link](../ee-tenant/profiling/continue-profile/)

![OffCPU Continuous Profiling Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3288a5dc39.png)

### Memory Profiling

DeepFlow can profile memory usage to find memory hotspot functions in application processes.

Entry: `Profiling` - `Continuous Profiling`. [Guide link](../ee-tenant/profiling/continue-profile/)

### Application Metrics Analysis

DeepFlow can integrate and analyze application-exposed metrics to find the root cause inside the program.

Entry: `Metrics` - `Metrics Viewing`. [Guide link](../ee-tenant/metrics/metrics-viewing/)

### Application Log Analysis

DeepFlow can integrate and analyze application logs to find the root cause inside the program.

Entry: `Log` - `Log`. [Guide link](../ee-tenant/log/log/)

## System Diagnosis

### File IO Event Analysis

When a `system Span` is identified as the Root Position in distributed tracing, you can instantly retrieve the list of slow file IO events associated with that Span to determine if file IO performance is the root cause.

Entry 1: `Tracing` - `Call Chain Tracing` - `IO Events`  
Entry 2: `Right Sliding Panel` - `File Read/Write Events`. [Guide link](../ee-tenant/tracing/right-sliding-box/)  
Entry 3: `Tracing` - `File Reading and Writing`. [Guide link](../ee-tenant/tracing/file-reading-and-writing/)

![File IO Event Analysis Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287b2741a.png)

### K8s Resource Change Event Analysis

Analyze the list of K8s resource change events at the anomaly time for the Root Position to determine if container creation/destruction is the root cause.

Entry 1: `Right Sliding Panel` - `Resource Change Events`. [Guide link](../ee-tenant/tracing/right-sliding-box/)  
Entry 2: `Resources` - `Change Events`. [Guide link](../ee-tenant/resources/resource-changes/)

![K8s Resource Change Event Analysis Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287e6aa0e.jpeg)

### System Metrics Analysis

DeepFlow can integrate and unify observation of system metrics for cloud servers and container nodes, quickly determining if system resources are the root cause at the anomaly time.

![Host Metrics List Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32896e4f7a.png)

### System Log Analysis

DeepFlow can integrate and analyze system logs to find the root cause inside the system.

## Network Diagnosis

### Network Metrics Analysis

When a `network Span` is identified as the Root Position in distributed tracing, you can instantly retrieve the `network performance` of the associated application call to determine delays in TCP handshake, TLS handshake, data exchange, and system response, identifying the key reason for slow network transmission:

- `TCP Connection Delay` — Delay during TCP three-way handshake  
- `TLS Connection Delay` — Delay during TLS handshake  
- `Average Data Delay` — Delay from request Data to response Data (average over multiple occurrences)  
- `Average System Delay` — Delay from request Data to ACK response (average over multiple occurrences)  
- `Average Client Wait Delay` — Delay from last ACK or response Data to next request (average over multiple occurrences)

![Network Metrics Analysis in Distributed Tracing Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328833d96a.png)

### Flow Log Analysis

If network performance analysis cannot fully determine the root cause, you can further `view flow logs` to examine detailed TCP session data for retransmissions, zero window, TCP RST, etc.

![Key Information in Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a51deb5.jpeg)

### TCP Sequence Analysis

If flow logs still cannot fully determine the root cause, you can view the `TCP sequence diagram` corresponding to the flow logs to examine packet interaction sequences and timing differences, identifying anomalies and finding the root cause.

![TCP Sequence Diagram Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3289a9c9aa.png)

**TCP Sequence Diagram Root Cause Analysis Case**

Fault: The server did not receive any new business requests within 15 seconds after sending a response packet to the client, triggering a timeout and closing the TCP connection. However, 53ns later, a new request packet arrived from the client. Since the TCP connection was already closed, the server could not process it and sent an RST to notify the client to stop sending requests.

Impact: The last application request had no response.

Solution: Increase the server’s TCP connection timeout (longer than the client’s) and ensure the client actively closes the TCP connection after each business process.

![TCP Sequence Diagram Fault Analysis Case](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a3b7ad0.jpeg)

### Network Device Metrics Analysis

DeepFlow can also integrate network device operational metrics via Telegraf. When distributed tracing locates the Root Position in the physical network, you can analyze network device metrics to find the root cause.

# Summary

By answering the five questions (**Who / When / Which / Where / What**), we can identify the root cause of a problem and provide targeted solutions to eliminate the fault.