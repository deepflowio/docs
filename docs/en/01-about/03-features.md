> This document was translated by GPT-4

---

title: Key Features of DeepFlow
permalink: /about/features

---

# Three Core Functions

By utilizing eBPF to collect data from application functions, system call functions, and network card transactions, DeepFlow first aggregates it into TCP/UDP flow logs (Flow Log), then it further recognizes the application protocol and aggregates the data into application invocation logs (Request Log). Subsequently, it calculates the full-stack RED (Request/Error/Delay) performance metrics and associates them with the generation of distributed tracing flame graphs. In addition, during the aggregation process of the flow log, DeepFlow calculates TCP throughput, delay, abnormal connection establishment, retransmissions, and zero windows, as well as other network layer performance metrics. It also calculates I/O throughput and latency metrics through hooking to file reading and writing operations, associating all these metrics with every invocation log. Furthermore, DeepFlow supports the acquisition of OnCPU/OffCPU function flame graphs for every process through eBPF, as well as the creation of Network Profile time series graphs through the analysis of TCP packets. All these capabilities ultimately manifest themselves in three core functions:

- Universal Map for Any Service, a universal map for any service
- Distributed Tracing for Any Request, distributed tracing for any call
- Continuous Profiling for Any Function, continuous profiling for any function

![DeepFlow based on eBPF's three core functions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9abb97855.png)

## Universal Service Map

**The universal map directly reflects the advantage of eBPF's non-intrusive technique—compared to APM's limited coverage ability, all services can appear on the universal map**. However, the invocation logs obtained through eBPF cannot be directly used for topology display. To resolve this, DeepFlow injects rich tags into all data, including cloud resource attributes, K8s resource attributes, custom K8s tags, etc. These tags can quickly filter out the universal map of specified businesses, and they can be grouped and displayed by different tags, such as K8s Pod, K8s Deployment, K8s Service, custom tags, etc. **Not only does the universal map describe the invocation relationship between services, but it also reveals the full-stack performance metrics along the invocation path**. For example, the image on the right side below demonstrates the step-by-step delay changes when the processes of two K8s services visit each other. We can swiftly find out whether the performance bottleneck lies in the business process, container network, K8s network, KVM network, or the Underlay network. Having sufficient observability data is a prerequisite for rapid triage.

![DeepFlow's universal map compared with the topology obtained by the APM Agent](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023110465463725dd5ff.png)

Currently, DeepFlow has built-in support for parsing mainstream application protocols, including HTTP 1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, DNS, with plans to extend its support for more application protocols in the future.

## Distributed Tracing

Non-intrusive Distributed Tracing (**AutoTracing**) is a major innovation in DeepFlow. During the data collection process via eBPF and cBPF, DeepFlow calculates syscall_trace_id, thread_id, goroutine_id, cap_seq, tcp_seq, etc. based on the system call context and enables **distributed tracing without modifying the application code or injecting TraceID and SpanID**. Currently, besides cross-thread (information passing through memory Queue or Channel) and asynchronous invocation, DeepFlow can achieve non-intrusive distributed tracing in all other aspects. It also supports parsing unique Request IDs injected by the application (for example, nearly all gateways inject 'X-Request-ID') to solve cross-thread and asynchronous issues. The image below compares the distributed tracing capabilities between DeepFlow and APM. APM can only trace services that have been instrumented, often covering Java services via Java Agent. DeepFlow uses eBPF to trace all kinds of services including Nginx, SLB, Spring Cloud Gateway microservice gateways, Envoy Service Mesh sidecars, as well as MySQL, Redis, CoreDNS, and other basic services (including their file reading and writing time), not to mention covering Pod NIC, Node NIC, KVM NIC, physical switches and other network transmission paths. It also offers indiscriminate support for Java, Golang, and all other languages.

![Comparison of distributed tracing between DeepFlow and APM](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091164febd459455b.png)

It is worth noting that the distributed tracing capabilities of eBPF and APM are not contradictory. APM can be used to trace the function call path within an application process and is proficient at handling cross-thread and asynchronous scenarios. On the other hand, eBPF has global coverage and can easily cover gateways, basic services, network paths, and multi-language services. In DeepFlow, we support the invocation of APM's Trace API to display the full link distributed tracing graph of APM + eBPF, we also provide an externally accessible 'Trace Completion API' that allows APM to invoke DeepFlow in order to obtain and associate eBPF tracing data. Additionally, DeepFlow can use the OTLP protocol to export its tracing data to APM.

![Integration between DeepFlow and APM](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

## Continuous Profiling

By capturing snapshots of the function call stack of an application, DeepFlow can draw any process's CPU Profile, thus helping developers swiftly locate function performance bottlenecks. **In addition to the business functions, it is also possible to show the time spent by the dynamically linked libraries and kernel system call functions in the function call stack**. In addition, when collecting function call stacks, DeepFlow generates a unique identifier, which can be associated with the call log, enabling the linkage of distributed tracing and function performance profiling. Especially, DeepFlow also analyzes each packet in the network with cBPF, making it possible to draw a Network Profile for each TCP stream under a low kernel environment, breaking down the connection establishment delay, system (ACK) delay, service response delay, client waiting delay, and pinpoint the code range of performance bottlenecks in applications.

![CPU Profile and Network Profile in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac3060c3.png)

# Injection of Business Semantics

Another purpose of using the APM Agent is to inject business semantics into the data, such as **information about a user associated with a call, transaction information, and the business module name where the service is located, etc.** It is challenging to extract business semantics from the original byte-stream collected through eBPF using a generic approach. To overcome this, DeepFlow has implemented two plug-in mechanisms to compensate for this deficiency: the Wasm Plugin to inject call granular business semantics, and an API to inject service granular business semantics.

**Firstly, injecting call granular business semantics through the Wasm Plugin**: The DeepFlow Agent has built-in parsing capabilities for common application protocols, and it is continuously adding more (the blue part in the image below are all natively supported protocols). However, we've found that the actual business environment can be much more complex: Developers insist on returning HTTP 200 while including error information in a self-defined JSON structure, a large amount of RPC's Payload part uses Protobuf, Thrift, and other serialization methods that depend on Schema for decoding, and the handling process of the call encounters cross-threading which causes eBPF AutoTracing to disconnect. To solve these issues, DeepFlow provides a Wasm Plugin mechanism, supporting developers to enhance the ProtocolParser in the Pipeline.

![Use DeepFlow's Wasm Plugin to inject call grain business semantics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac4b08f7.png)

Actually, we've also observed that in the finance, telecommunications, gaming and other industries, there already exist 'natural' distributed tracing markers, such as the global transaction serial number in financial business, call ID in core network of telecommunications, business request ID in gaming business etc. These IDs will be embedded in all calls, but their specific positions are determined by the business itself. With the flexibility provided by the Wasm Plugin, developers can easily write plugins to support the extraction of these identifiers as TraceID.

**Secondly, injecting service granular business semantics through API**: By default, DeepFlow's SmartEncoding mechanism will automatically inject unified attribute tags into all observation signals, including cloud resources, container K8s resources, and K8s' custom Label/Annotation tags. However, these tags only reflect the semantics at the application level. To help users inject business semantics from systems like CMDB into the observation data, DeepFlow provides an API set for business tag injection.

# Ecosystem and Performance

DeepFlow wholeheartedly embraces the open-source community. Apart from utilizing eBPF techniques to collect observation data non-intrusively, DeepFlow also supports the integration of mainstream observability technology stacks. For instance, it serves as the storage backend of Prometheus, OpenTelemetry, SkyWalking, Pyroscope, etc., and provides SQL, PromQL, OTLP Export interfaces as the data source for Grafana, Prometheus, OpenTelemetry, SkyWalking. This allows developers to quickly integrate it into their own observability solutions.

![Integration of DeepFlow with mainstream observability technology stacks](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b163cac67.png)

When used as a storage backend, DeepFlow does more than just storing data. Leveraging its exclusive AutoTagging and SmartEncoding mechanisms, it efficiently and automatically injects unified property tags into all observation signals, eliminating data silos and enhancing data drilling capabilities.

The pursuit of high performance is reflected in multiple aspects. Since 2016, DeepFlow Enterprise Edition initially implemented the Agent using Golang. Starting from 2021, we decided to rewrite the Agent in Rust. This decision allowed us to consume fewer resources when handling massive amounts of eBPF/BPF data, typically equivalent to 1%~5% of the application itself. Rust provides extreme memory safety and performance close to C, particularly in terms of memory consumption, GC, etc., it has significant advantages over Golang. These advantages also make the Agent suitable for running within the Android operating system on end-user devices.

In contrast, DeepFlow Server still uses Golang, allowing us to have a higher iteration speed. Thanks to our profound accumulation in Agent-coded Golang, our rewritten high-performance maps and high-performance pools have achieved a ten-fold performance increase, significantly reducing the Server's resource consumption. In a production environment with 1M Spans written per second, the resources consumed by the Server are generally 1% of those consumed by the business operation.

![SmartEncoding in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

Performance optimization related to observation data is represented in the SmartEncoding mechanism. The Agent receives tag information in the form of strings through information synchronization and summarizes it to the Server. The Server encodes all tags, injects the unified Int-type tags into all data, and stores it in the database. At the same time, Grafana can directly query for filtering and grouping using string-format tags. This encoding mechanism can increase tag write performance by 10 times, significantly reducing the resource expense of data storage. In addition to this, the Server stores K8s tags separately from the observation data as metadata, so there is no need to store all tags in each row of observation data, further reducing resource consumption by half. Finally, this encoding mechanism also reduces the amount of disk scanning during data queries, improving search performance.
