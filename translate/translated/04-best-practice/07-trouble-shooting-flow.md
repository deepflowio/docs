---
title: General Methods for Business Fault Diagnosis and Localization
permalink: /best-practice/trouble-shooting-flow/
---

> This document was translated by ChatGPT

# Overview

## Unified Observability Data Lake

The DeepFlow observability platform aggregates a vast array of observability data, including metrics, tracing, logging, profiling, and events, through eBPF collection and open data interfaces.

With AutoTagging label injection technology, DeepFlow can inject all observability data with rich textual tags, including resource tags and business tags. These tags contain semantic information such as cloud resource information of application instances, container resource information, developers, maintainers, version numbers, commit_id, repository addresses marked in CI/CD pipelines, etc. By injecting tag information, during fault diagnosis, all metrics, tracing, logging, profiling, and events data related to a specific business or application can be retrieved with a single text field search and presented on a dashboard. Engineers can then analyze the data in 3-5 steps to reach a fault diagnosis conclusion.

![Unified Observability Data Lake](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3281c6db18.jpeg)

## Unified Collaboration Across Multiple Teams

In common IT business system operations, business deployments span multiple availability zones, with complex architectures and numerous components. Operations and fault diagnosis involve extensive communication and collaboration between different teams, including applications, PaaS platforms, IaaS clouds, etc. The DeepFlow observability platform breaks down data silos, builds data associations, and provides unified observability and collaboration capabilities for operations teams across applications, PaaS, IaaS, and networks.

![Unified Collaboration Across Multiple Teams](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0683ed7b.jpeg)

## From Macro to Micro, From One-Dimensional to Multi-Dimensional

![Fault Diagnosis Process Starting from Applications](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0696e08d.jpeg)

In the DeepFlow observability platform, fault diagnosis generally follows a process of application RED metrics observation, call log retrieval, distributed tracing, multi-dimensional application diagnosis, multi-dimensional system diagnosis, and multi-dimensional network diagnosis. This process moves from macro to micro, from one-dimensional data observation to multi-dimensional data analysis, gradually answering the following five questions to diagnose the root cause of the problem:

- **Who is in trouble?**
- **When it's in trouble?**
- **Which request is in trouble?**
- **Where is the root position?**
- **What is the root cause?**

# Macro - Metrics Analysis and Early Warning

## Application RED Metrics Observation

In IT system operations, the **RED** metrics (Rate, Error, Duration) are commonly used as core monitoring indicators to evaluate the business quality/application service quality of the system:

- **Rate** (Request Rate) - Represents the number of requests received per unit time, used to measure the throughput/pressure of the service.
- **Error** (Error Rate) - Represents the proportion of requests that return error responses, used to detect service anomalies. Errors are usually divided into client-side errors and server-side errors, with server-side errors being the primary focus of applications.
- **Duration** (Response Time) - Represents the time taken from request to response, used to detect slow service responses. Commonly observed statistics include "average response time," "P95 response time," and "P99 response time."

In the DeepFlow platform, RED metrics for application calls are also used as the entry point for observability and fault diagnosis. Typically, filters are applied based on different dimensions such as namespace (pod_ns), container service (pod_service), workload (pod_group), and application call protocol (l7_protocol) to observe the RED metrics of the objects of interest.

- Step 1: If you are an operations personnel for a specific application system, and the application modules are deployed and isolated in a K8s namespace named "A," you can use `pod_ns = A` to observe the RED metrics of all application services in that business system.
- Step 2: If you want to further narrow down the observation to a container service named "b" within the "A" namespace, you can add a `pod_svc = b` filter condition.
- Step 3: If you want to observe only the RED metrics for HTTP protocol calls, you can add a `l7_protocol = http` filter condition.

At this point, you can start your observability journey with the DeepFlow platform.

![DeepFlow Application RED Metrics Observation](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32824d0259.jpeg)

Of course, DeepFlow also provides more filter conditions for flexible use in different scenarios, which you can explore in future usage.

By observing the RED metrics of application services, you can answer the **Who** and **When** questions, namely:

- **Who is in trouble?** - Which observability object (e.g., a container service, a workload, a Pod, a specific path in the IT system) is experiencing service quality issues (response errors, slow responses, or timeouts) that require attention.
- **When it's in trouble?** - At what time did the anomaly occur?

The next step is to quickly retrieve every abnormal application call at the abnormal time point and start micro-level observation of each abnormal application call.

# Micro - Call Tracing and Triage

## Call Log Retrieval

The DeepFlow platform provides a hidden "right slide window" for each observability object. By clicking on any observability object in the metrics curve or metrics statistics list, the "right slide window" will automatically expand. The "right slide window" provides a series of data observation windows, including "application metrics," "endpoint list," "call logs," "network metrics," etc., for analyzing data from different dimensions of the observability object.

The "call logs" in the "right slide window" can answer the **Which** question (**Which request is in trouble?**) - that is, which application call is abnormal?

Retrieve all call logs at the abnormal time point and filter out the abnormal application calls (response errors, slow responses, or timeouts):

![DeepFlow Call Log Retrieval](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282b398ec.jpeg)

## Distributed Tracing

After identifying a single abnormal request, you can perform distributed tracing on the single abnormal request in the DeepFlow platform to answer the **Where** question (**Where is the root position of the trouble?**) - that is, find the root cause Span of response errors, slow responses, or timeouts through the distributed tracing flame graph.

![DeepFlow Distributed Tracing Diagram](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282d820d0.jpeg)

Background Reading:

- [3 Minutes to Understand DeepFlow Distributed Tracing Flame Graph](https://www.bilibili.com/video/BV1di421k7JE/)
- [3 Minutes to Understand the Implementation Principle of DeepFlow Distributed Tracing](https://www.bilibili.com/video/BV1ZC411E7ad/)

## Common Examples and Analysis of Distributed Tracing Flame Graphs

We use a simplified application service model to understand how to quickly find the **Root Position** through the DeepFlow distributed tracing flame graph.
In this scenario, the Client uses `http get` to access the front-end service, which queries the DNS service, accesses the MySQL database, makes an RPC call, and finally returns an `http response` to the Client.
![Simplified Application Service Model](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328390aa62.png)

### Application Issues

- Application Service - Slow IO Thread

If there is a significant delay between the "POD NIC Span" and the "System Span" of the front-end service, it can be determined that the `http get` experienced a delay when entering the processing queue of the front-end service from the POD NIC queue.
Common causes include busy IO thread scheduling.

![Flame Graph Example 1 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284a1f3bb.png)

- Application Service - Slow Work Thread

If there is a significant delay between the "System Span" of receiving the `http get` and the "System Span" of sending the `dns query` in the front-end service, it can be determined that the front-end service experienced a delay during internal processing.
Common causes include busy work thread scheduling.

![Flame Graph Example 2 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284d7fe39.png)

- Middleware - Slow DNS Service Response

If the "System Span" of the DNS service shows a significant duration, it can be determined that the DNS service process took too long to query and return the DNS resolution result, directly causing the slow response of this business request.

![Flame Graph Example 3 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328508566e.png)

- Middleware - Slow MySQL Service Response

Similar to the DNS service, if the "System Span" of the MySQL service shows a significant duration, it can be determined that the MySQL service process took too long to process and return the result, directly causing the slow response of this business request.

![Flame Graph Example 4 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285438f40.png)

- Other Application Services - Slow RPC Service Response

Similar to the DNS service, if the "System Span" of the RPC service shows a significant duration, it can be determined that the RPC service process took too long to process and return the result, directly causing the slow response of this business request.

![Flame Graph Example 5 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328575653a.png)

- Client - Slow Process Handling

If the `http response` returned by the front-end service to the Client takes a while to reach the "System Span" after reaching the "POD NIC Span" of the Client, it can be determined that the `http response` experienced a delay when entering the processing queue of the Client process from the POD NIC queue.

![Flame Graph Example 6 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285982a40.png)

### Network Issues

- Network Transmission - Slow TCP Connection Establishment

If there is a significant delay between the "System Span" and the "POD NIC Span" of the Client, it can be determined that the `http get` experienced a delay before entering the network.

This situation generally occurs when the Client uses a short TCP connection, requiring the establishment of a TCP connection before sending the `http get`. Packet loss or delays during the TCP three-way handshake can cause this issue.

![Flame Graph Example 7 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3283e248cf.png)

- Network Transmission - Slow Transmission Within Client Container Node

If there is a significant delay between the "POD NIC Span" and the "Node NIC Span" of the Client, it can be determined that the `http get` experienced a delay during transmission within the virtual network of the Client container node.

![Flame Graph Example 8 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284069e45.png)

- Network Transmission - Slow Transmission Between Container Nodes

If there is a significant delay between the "Node NIC Span" of the Client and the "Node NIC Span" of the front-end service, it can be determined that the `http get` experienced a delay during transmission between the two container nodes.

![Flame Graph Example 9 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284283c8e.png)

- Network Transmission - Slow Transmission Within Server Container Node

If there is a significant delay between the "Node NIC Span" and the "POD NIC Span" of the front-end service, it can be determined that the `http get` experienced a delay during transmission within the virtual network of the server container node.

![Flame Graph Example 10 (Diagram)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328473bf8b.png)

# Multi-Dimensional Analysis - Root Cause Diagnosis

After the DeepFlow platform's application distributed tracing helps us answer the question "Where is the root position?", the next step is to conduct multi-dimensional data analysis around the **Root Position** to answer the question "What is the root cause?".

- When distributed tracing determines the problem boundary is a specific application process, you can enter the "application diagnosis" phase to analyze and diagnose multiple dimensions of data for the application instance to determine the root cause of the application fault.
- When distributed tracing determines the problem boundary is due to network transmission, you can enter the "network diagnosis" phase to analyze and diagnose multiple dimensions of data for network transmission to determine the root cause of the network fault.
- When the problem is related to system performance (e.g., system CPU usage, system load, system interfaces), you can enter the "system diagnosis" phase to analyze and diagnose multiple dimensions of data for the operating system to determine the root cause of the operating system fault.

## Application Diagnosis

If the **Root Position** is a specific application instance, you can analyze the application instance's resource metrics (CPU, memory, disk, etc.), OnCPU continuous profiling, OffCPU continuous profiling, memory profiling, application metrics analysis, and application log retrieval in the DeepFlow platform to find the **Root Cause** within the application.

### Application Instance Resource Metrics Analysis

In the DeepFlow platform, you can integrate and uniformly observe and analyze the computing resource metrics of container Pods/Containers. By quickly identifying the metrics at the abnormal time point, you can determine whether container resources are the Root Cause.

- Pod Status List Observation

![POD Status Observation Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32862b4f18.jpeg)

- Container Metrics Details Observation

![Container Metrics Observation Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328672066c.png)

### OnCPU Continuous Profiling

In the DeepFlow platform, you can perform continuous profiling of the application's OnCPU to identify CPU hotspot functions within the application process.

![OnCPU Continuous Profiling Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3286e73055.png)

### OffCPU Continuous Profiling

In the DeepFlow platform, you can perform continuous profiling of the application's OffCPU to identify blocked functions within the application due to IO waits, locks, etc.

![OffCPU Continuous Profiling Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3288a5dc39.png)

### Memory Profiling

In the DeepFlow platform, you can perform memory profiling of the application to identify memory hotspot functions within the application process.

### Application Metrics Analysis

In the DeepFlow platform, you can integrate and uniformly analyze the metrics actively exposed by the application to identify the Root Cause within the program through application metrics.

### Application Log Analysis

In the DeepFlow platform, you can integrate and uniformly analyze the logs actively printed by the application to identify the Root Cause within the program through application logs.

## System Diagnosis

### File IO Event Analysis

When distributed tracing determines a specific "System Span" as the Root Position, you can immediately retrieve the list of slow file IO events accompanying that Span to determine whether file IO performance is the Root Cause.

![File IO Event Analysis Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287b2741a.png)

### K8s Resource Change Event Analysis

Analyze the list of K8s resource change events at the abnormal time point for the Root Position to determine whether container creation or destruction processes are the Root Cause.

![K8s Resource Change Event Analysis Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287e6aa0e.jpeg)

### System Metrics Analysis

In the DeepFlow platform, you can integrate and uniformly observe and analyze the system metrics of cloud servers and container nodes. By quickly identifying the system metrics at the abnormal time point, you can determine whether system resources are the Root Cause.

- Host Metrics List Observation

![Host Metrics List Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32896e4f7a.png)

### System Log Analysis

In the DeepFlow platform, you can integrate and uniformly analyze the logs output by the system to identify the Root Cause within the system through system logs.

## Network Diagnosis

### Network Metrics Analysis

When distributed tracing determines a specific "Network Span" as the Root Position, you can immediately retrieve the "network performance" associated with that application call to determine the key reasons for slow network transmission, such as:

- TCP Connection Delay - The delay during the TCP three-way handshake process;
- TLS Connection Delay - The delay during the TLS connection process;
- Average Data Delay - The delay from request Data to response Data (average of multiple processes);
- Average System Delay - The delay from request Data to reply ACK message (average of multiple processes);
- Average Client Wait Delay - The delay from the last ACK message or response Data to the next request (average of multiple processes).

![Network Metrics Analysis Example in Distributed Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328833d96a.png)

### Flow Log Analysis

When retrieving the "network performance" associated with the application call does not fully determine the Root Cause, you can further "view flow logs" to retrieve detailed data of the TCP session and determine whether there are retransmissions, zero windows, TCP RST, etc.

![Key Information in Flow Logs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a51deb5.jpeg)

### TCP Sequence Analysis

When flow logs alone do not provide a clear Root Cause, you can further investigate by viewing the corresponding "TCP Sequence Diagram" associated with the flow logs. This diagram allows you to examine the interaction process of each data packet within a TCP session, helping to identify anomalies in packet interaction sequences, unusual time gaps between packets, and other information that can lead to discovering the Root Cause.

![TCP Sequence Diagram Example](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3289a9c9aa.png)

- **TCP Sequence Diagram Root Cause Analysis Case Study**

  **Issue Description:** After the server responded to a client's data packet, no new business requests were received within 15 seconds, triggering a timeout and closing the TCP connection. However, 53 nanoseconds later, a new business request packet was received from the client. Since the TCP connection had already been closed on the server side, the server could not process the packet and had to send an RST message to notify the client to stop sending requests.

  **Impact:** The last application request went unanswered.

  **Solution:** Increase the TCP connection timeout duration on the server (longer than on the client side) and ensure that the client actively closes the TCP connection after each business transaction is completed.

![TCP Sequence Diagram Issue Analysis Case Study](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a3b7ad0.jpeg)

### Network Device Metrics Analysis

On the DeepFlow platform, you can also monitor the operational metrics of network devices through Telegraf integration. When distributed tracing identifies that the Root Cause is within the physical network, you can perform unified observation and analysis of the network device metrics to locate the Root Cause within the network infrastructure.
