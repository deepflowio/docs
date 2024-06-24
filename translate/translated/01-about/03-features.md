---
title: DeepFlow Key Features
permalink: /about/features
---

> This document was translated by ChatGPT

# Three Core Functions

By leveraging eBPF to collect data from application functions, system call functions, and network card transmissions, DeepFlow first aggregates this data into TCP/UDP flow logs. After identifying application protocols, it further aggregates these into application request logs, calculates full-stack RED (Request/Error/Delay) performance metrics, and generates distributed tracing flame graphs. Additionally, during the flow log aggregation process, DeepFlow calculates network layer performance metrics such as TCP throughput, latency, connection anomalies, retransmissions, and zero windows. It also calculates IO throughput and latency metrics by hooking file read/write operations, associating all these metrics with each request log. Furthermore, DeepFlow supports obtaining On-CPU and Off-CPU function flame graphs for each process via eBPF and analyzing TCP packets to draw Network Profile timelines. All these capabilities are ultimately reflected in three core functions:

- Universal Map for Any Service
- Distributed Tracing for Any Request
- Continuous Profiling for Any Function

![Three Core Functions of DeepFlow Based on eBPF](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9abb97855.png)

## Universal Service Map

**The universal map directly showcases the zero-intrusion advantage of eBPF, compared to the limited coverage of APM, all services can appear in the universal map**. However, the call logs obtained by eBPF cannot be directly used for topology presentation. DeepFlow enriches all data with extensive tags, including cloud resource attributes, K8s resource attributes, and custom K8s tags. These tags allow for quick filtering of specific business universal maps and can be grouped and displayed by different tags, such as K8s Pod, K8s Deployment, K8s Service, and custom tags. **The universal map not only describes the call relationships between services but also shows full-stack performance metrics along the call path**. For example, the right side of the figure below shows the hop-by-hop latency changes when two K8s service processes access each other. We can quickly identify whether the performance bottleneck lies in the business process, container network, K8s network, KVM network, or Underlay network. Sufficient neutral observation data is essential for rapid triage.

![Comparison of DeepFlow's Universal Map and APM Agent's Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96e6c99ef.png)

Currently, DeepFlow has built-in support for parsing mainstream application protocols, including HTTP 1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, and DNS, with plans to support more application protocols in the future.

## Distributed Tracing

Zero-intrusion distributed tracing (**AutoTracing**) is a major innovation in DeepFlow. When collecting call logs via eBPF and cBPF, DeepFlow calculates information such as syscall_trace_id, thread_id, goroutine_id, cap_seq, and tcp_seq based on the system call context, **achieving distributed tracing without modifying application code or injecting TraceID and SpanID**. Currently, DeepFlow can achieve zero-intrusion distributed tracing except for cross-thread (information passed through memory Queue or Channel) and asynchronous calls. It also supports parsing unique Request IDs injected by applications (e.g., almost all gateways inject X-Request-ID) to solve cross-thread and asynchronous issues. The figure below compares the distributed tracing capabilities of DeepFlow and APM. APM can only trace instrumented services, commonly using Java Agent to cover Java services. DeepFlow uses eBPF to trace all services, including Nginx and other SLBs, Spring Cloud Gateway and other microservice gateways, Envoy and other Service Mesh sidecars, as well as MySQL, Redis, CoreDNS, and other foundational services (including their file read/write times). Additionally, it covers Pod NIC, Node NIC, KVM NIC, and physical switch network transmission paths, and more importantly, it supports Java, Golang, and all languages without discrimination.

![Comparison of Distributed Tracing in DeepFlow and APM](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96eb4e2e2.png)

Note that the distributed tracing capabilities of eBPF and APM are not contradictory. APM can be used to trace function call paths within application processes and is adept at solving cross-thread and asynchronous scenarios. eBPF has global coverage capabilities, easily covering gateways, foundational services, network paths, and multi-language services. In DeepFlow, we support invoking APM's Trace API to display a full-link distributed tracing map of APM + eBPF, and also provide the `Trace Completion API` for APM to call DeepFlow to obtain and associate eBPF tracing data. Additionally, DeepFlow and APM can use the OTLP protocol to export their tracing data to each other.

![Integration of DeepFlow and APM](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

## Continuous Profiling

By capturing snapshots of application function call stacks, DeepFlow can draw CPU Profiles for any process, helping developers quickly locate function performance bottlenecks. **In addition to business functions, the function call stack also shows the time consumption of dynamic link libraries and kernel system call functions**. Moreover, DeepFlow generates unique identifiers when collecting function call stacks, which can be associated with call logs to achieve linkage between distributed tracing and function performance profiling. Specifically, DeepFlow also uses cBPF to analyze packets in the network, allowing it to draw Network Profiles for each TCP flow in low-kernel environments, profiling connection latency, system (ACK) latency, service response latency, and client wait latency, which can be used to infer the code range of performance bottlenecks in applications.

![CPU Profile and Network Profile in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# Injecting Business Semantics

Another demand for using APM Agents is to inject business semantics into the data, such as **user information, transaction information, and the business module name associated with a call**. It is challenging to extract business semantics from the raw byte stream collected by eBPF using a general method. In DeepFlow, we have implemented two plugin mechanisms to address this shortcoming: injecting call-level business semantics via Wasm Plugin and injecting service-level business semantics via API.

**First, injecting call-level business semantics via Wasm Plugin**: DeepFlow Agent has built-in parsing capabilities for common application protocols and is continuously iterating to add more. The blue parts in the figure below are natively supported protocols. We found that the actual business environment is more complex: developers may insist on returning HTTP 200 while placing error information in a custom JSON structure, and many RPC payloads use serialization methods like Protobuf or Thrift that rely on schemas for decoding. Additionally, cross-thread occurrences in the call processing flow can cause eBPF AutoTracing to break. To solve these issues, DeepFlow provides a Wasm Plugin mechanism, allowing developers to enhance the ProtocolParser in the pipeline.

![Injecting Call-Level Business Semantics via DeepFlow Wasm Plugin](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac4b08f7.png)

In fact, we have also observed "natural" distributed tracing markers in industries such as finance, telecommunications, and gaming, such as global transaction serial numbers in financial services, call IDs in telecom core networks, and business request IDs in gaming services. These IDs are carried in all calls, but their specific locations are determined by the business itself. The flexibility provided by the Wasm Plugin allows developers to easily write plugins to extract this information as TraceID.

**Second, injecting service-level business semantics via API**: By default, DeepFlow's SmartEncoding mechanism automatically injects cloud resources, container K8s resources, and K8s custom Label/Annotation tags into all observation signals. However, these tags only reflect application-level semantics. To help users inject business semantics from systems like CMDB into observation data, DeepFlow provides a set of APIs for business tag injection.

# Ecosystem and Performance

DeepFlow fully embraces the open-source community. In addition to collecting observation data with zero intrusion using eBPF technology, DeepFlow also supports integration with mainstream observability technology stacks, such as serving as a storage backend for Prometheus, OpenTelemetry, SkyWalking, Pyroscope, and more. It provides SQL, PromQL, and OTLP Export interfaces as data sources for Grafana, Prometheus, OpenTelemetry, and SkyWalking, allowing developers to quickly integrate it into their own observability solutions.

![Integration of DeepFlow with Mainstream Observability Technology Stacks](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f3219cd.png)

When serving as a storage backend, DeepFlow does more than just store data. Utilizing its unique AutoTagging and SmartEncoding mechanisms, it injects unified attribute tags into all observation signals in a high-performance, automated manner, eliminating data silos and enhancing data drill-down capabilities.

The pursuit of high performance is reflected in multiple aspects. Since 2016, the earliest DeepFlow enterprise version used Golang to implement the Agent. Starting in 2021, we decided to refactor the Agent using Rust. This decision allows us to consume fewer resources when processing massive eBPF/BPF data, typically equivalent to 1%~5% of the application's own consumption. Rust offers extreme memory safety and performance close to C, with significant advantages over Golang in terms of memory consumption and garbage collection. These advantages also make the Agent suitable for running on terminal devices with Android operating systems.

In contrast, the DeepFlow Server is still implemented in Golang, allowing us to achieve higher iteration speeds. Thanks to our extensive experience with the Golang version of the Agent, our rewritten high-performance map and high-performance pool have achieved a tenfold performance improvement, significantly reducing the Server's resource consumption. In a production environment writing 1M spans per second, the Server's resource consumption is generally 1% of the business's own consumption.

![SmartEncoding in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

Performance optimization directly related to observation data is reflected in the SmartEncoding mechanism. The Agent synchronizes information to obtain string-formatted tags, which are aggregated on the Server. The Server encodes all tags, injecting unified Int-type tags into all data and storing them in the database. Meanwhile, Grafana can directly filter and group queries using string-formatted tags. This encoding mechanism can improve tag writing performance by ten times, significantly reducing data storage resource consumption. Additionally, the Server separates K8s tags from observation data as metadata, eliminating the need to store all tags in each row of observation data, further reducing resource consumption by half. Finally, this encoding mechanism also reduces disk scan volume during data queries, enhancing search performance.