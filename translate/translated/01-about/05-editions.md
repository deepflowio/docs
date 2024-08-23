---
title: DeepFlow Products
permalink: /about/editions
---

> This document was translated by ChatGPT

# Community Edition

DeepFlow Community Edition is an open-source version, a highly automated observability `data platform`.
Its core is licensed under Apache 2.0, and the frontend is entirely based on Grafana, thus adopting the AGPL license.
It includes common features needed for efficient observability construction, such as:

- Universal Map (AutoMetrics)
  - Automatically collects application, network, and system full-stack performance metrics based on eBPF/cBPF
  - Automatically collects TCP/UDP flow logs based on eBPF/cBPF
  - Automatically collects application call logs for HTTP1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, bRPC, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, AMQP (RabbitMQ), OpenWire (ActiveMQ), NATS, Pulsar, ZMTP (ZeroMQ), RocketMQ, DNS, etc., based on eBPF/cBPF
- Distributed Tracing (AutoTracing)
  - Automatically traces microservice distributed call chains based on eBPF/cBPF
- Continuous Profiling (AutoProfiling)
  - Supports zero-intrusion On-CPU continuous profiling based on eBPF
  - Supports JVM languages, compiled languages like C/C++/Golang/Rust
- Integration
  - Integrates Prometheus/Telegraf metrics data to solve data silos and high cardinality issues
  - Integrates OpenTelemetry/SkyWalking tracing data to achieve full-stack distributed tracing
  - Integrates Vector log data to solve data silos and resource consumption issues
- AutoTagging
  - Supports synchronization of public cloud resource tags and automatically injects them into all observability data
  - Supports synchronization of container resource tags and custom labels, and automatically injects them into all observability data
  - Supports SmartEncoding for high-performance data tag storage
- Integration and Management
  - Supports using Grafana to display metrics and tracing data
  - Supports unified monitoring of multiple K8s clusters and regular cloud servers
  - The collection agent supports running on K8s nodes, Serverless Pods, and Linux Host environments
  - Supports deployment on X86 and ARM architectures

# Enterprise Edition

DeepFlow Enterprise Edition is a highly automated `one-stop` observability `analysis platform`,
featuring enterprise-level visualization and management interfaces, complete data analysis capabilities, and enhanced data governance capabilities.
In addition to all the features of the Community Edition, it also includes:

- More powerful AutoMetrics, AutoTracing, AutoProfiling data
  - Supports collecting application call logs for TLS, Oracle, etc., and supports TCP stream reassembly based on eBPF/cBPF
  - Supports zero-intrusion Off-CPU, Memory, GPU continuous profiling based on eBPF, and supports interpreted languages like Python
  - Supports TCP per-packet sequence diagrams and raw packet Network Profiling capabilities based on cBPF
  - The agent supports running on multi-tenant Serverless K8s nodes, Android devices, and Windows Hosts
  - The agent supports running on KVM/HyperV/ESXi/Xen host environments
  - The agent supports running on hosts and physical servers using the DPDK data plane
  - The agent supports running on dedicated servers to collect and analyze mirror traffic from physical switches, analyzing the performance of traditional Layer 4-7 gateways and proprietary cloud Layer 4-7 gateways
  - The agent supports running on dedicated servers to collect NetFlow and sFlow data from physical switches
- AutoTagging
  - Deeply adapted to proprietary cloud products, including major cloud platforms like Alibaba Cloud, Tencent Cloud, Huawei Cloud, etc.
- Analysis Capabilities
  - Supports correlation queries and automatic jumps for metrics, tracing, and log data
  - Supports one-stop alerting, reporting, custom dashboards, and other multi-team collaboration features
- Advanced Features
  - Supports configuring traffic filtering policies on demand and distributing traffic to security, network, audit, and other traffic consumption tools
  - Supports providing services for multiple tenants and data permission isolation
  - Supports encrypted data transmission between the agent and server
  - Supports unified monitoring of proprietary cloud, public cloud, and container resources across multiple regions
- Enterprise-Level Services
  - Provides comprehensive cloud-native observability solutions for industries such as finance, energy, telecommunications (IT, 5GC), and the Internet of Vehicles
  - Provides enterprise-level after-sales support services, including fault troubleshooting, performance tuning, version upgrades, and best practices for observability implementation

# Cloud Edition

DeepFlow Cloud Edition is a fully managed one-stop observability platform,
featuring the same functionalities as the Enterprise Edition and is currently in the testing trial phase.

# Feature Comparison

| Module               | <center>Supported Capabilities</center>    | Community Edition | Enterprise Edition |
| -------------------- | :---------------------------------------- | ----------------- | ------------------ |
| Universal Map        | eBPF/cBPF AutoMetrics                     | ✔                 | ✔                  |
|                      | Application Protocol Parsing - TLS, Oracle|                   | ✔                  |
|                      | Application Protocol Parsing - Others     | ✔                 | ✔                  |
|                      | Enhanced Protocol Parsing via TCP Reassembly|                  | ✔                  |
|                      | Wasm/so Protocol Parsing Plugin SDK       | ✔                 | ✔                  |
|                      | Application Performance Metrics - Process/Container/Cloud Server | ✔ | ✔ |
|                      | Application Performance Metrics - Host/Proprietary Cloud Gateway/Network Device | | ✔ |
|                      | Network Performance Metrics - Process/Container/Cloud Server | ✔ | ✔ |
|                      | Network Performance Metrics - Host/Proprietary Cloud Gateway/Network Device | | ✔ |
|                      | Network Performance Metrics - NetFlow/sFlow | | ✔ |
|                      | Database Performance Metrics - Process/Container/Server | ✔ | ✔ |
|                      | Database Performance Metrics - Host/Proprietary Cloud Gateway | | ✔ |
|                      | Application Call Logs - Process/Container/Server | ✔ | ✔ |
|                      | Application Call Logs - Host/Proprietary Cloud Gateway/Network Device | | ✔ |
|                      | Network Flow Logs - Process/Container/Server | ✔ | ✔ |
|                      | Network Flow Logs - Host/Proprietary Cloud Gateway/Network Device | | ✔ |
|                      | Network Flow Logs - NetFlow/sFlow | | ✔ |
| Distributed Tracing  | eBPF/cBPF AutoTracing                     | ✔                 | ✔                  |
|                      | Enhanced AutoTracing with X-Request-ID    | ✔                 | ✔                  |
|                      | Enhanced AutoTracing with MySQL Comment   | ✔                 | ✔                  |
|                      | Enhanced AutoTracing with Open Source APM TraceID | ✔ | ✔ |
|                      | Enhanced AutoTracing with Proprietary APM TraceID | | ✔ |
|                      | Wasm/so AutoTracing Enhancement Plugin SDK | ✔ | ✔ |
|                      | Integration with APM Span - OpenTelemetry/SkyWalking | ✔ | ✔ |
|                      | Trace Map for Link Topology               |                   | ✔                  |
|                      | eBPF Span - kprobe/uprobe                 | ✔                 | ✔                  |
|                      | cBPF Span - Container/Cloud Server        | ✔                 | ✔                  |
|                      | cBPF Span - Host/Proprietary Cloud Gateway/Network Device | | ✔ |
|                      | Proprietary Cloud Gateway Intelligent NAT Tracing | | ✔ |
| Continuous Profiling | eBPF AutoProfiling - On-CPU               | ✔                 | ✔                  |
|                      | eBPF AutoProfiling - Off-CPU              |                   | ✔                  |
|                      | eBPF AutoProfiling - Memory               |                   | ✔                  |
|                      | eBPF AutoProfiling - GPU Kernel           |                   | ✔                  |
|                      | eBPF AutoProfiling - GPU HBM              |                   | ✔                  |
|                      | eBPF AutoProfiling - RDMA                 |                   | ✔                  |
|                      | JVM Language AutoProfiling                | ✔                 | ✔                  |
|                      | C/C++/Golang/Rust Language AutoProfiling  | ✔                 | ✔                  |
|                      | Python Language AutoProfiling             |                   | ✔                  |
|                      | AutoProfiling for Unsigned Processes      |                   | ✔                  |
|                      | TCP Per-Packet Sequence Diagram (Network Profiling) | | ✔ |
|                      | Packet Backtracking (Network Profiling)   |                   | ✔                  |
| Event                | eBPF AutoEvents                           | ✔                 | ✔                  |
|                      | Linux File Read/Write AutoEvents          | ✔                 | ✔                  |
|                      | Cloud Resource, Container Resource Change Events | ✔ | ✔ |
| AutoTagging          | SmartEncoding                             | ✔                 | ✔                  |
|                      | K8s Container Resource, Custom Label Tags | ✔                 | ✔                  |
|                      | K8s Custom Annotation/Env Tags            |                   | ✔                  |
|                      | Public Cloud Resource Tags                | ✔                 | ✔                  |
|                      | Public Cloud Custom Business Tags         |                   | ✔                  |
|                      | Private Cloud/Proprietary Cloud Resource Tags | | ✔ |
|                      | Private Cloud/Proprietary Cloud Custom Business Tags | | ✔ |
|                      | Provides API Support for Injecting CMDB Business Tags | ✔ | ✔ |
|                      | Provides Plugin Mechanism for Injecting Process Business Tags | ✔ | ✔ |
| Integration          | Integration with Prometheus/Telegraf Metrics Data | ✔ | ✔ |
|                      | Integration with OpenTelemetry/SkyWalking Tracing Data | ✔ | ✔ |
|                      | Integration with Pyroscope Continuous Profiling Data | ✔ | ✔ |
|                      | Integration with Vector Log Data          | ✔                 | ✔                  |
|                      | Provides SQL, PromQL API                  | ✔                 | ✔                  |
|                      | Provides Grafana Datasource and Panel     | ✔                 |                    |
|                      | Uses Grafana Tempo to Display Distributed Tracing Data | ✔ | |
|                      | Outputs Tracing Data to SkyWalking        | ✔                 | ✔                  |
|                      | Outputs Tracing Data to OpenTelemetry Collector | ✔ | ✔ |
|                      | Outputs Metrics/Tracing/Event Data to Kafka | ✔ | ✔ |
|                      | Outputs Metrics Data to Prometheus        | ✔                 | ✔                  |
| Analytics            | Enterprise-Level Observability Analysis Platform | | ✔ |
|                      | Custom Dashboard Management               |                   | ✔                  |
|                      | Alert Management                          |                   | ✔                  |
|                      | Report Management                         |                   | ✔                  |
| Compatibility        | Agent/Server Runs on X86/ARM Servers      | ✔                 | ✔                  |
|                      | Agent Runs on Proprietary K8s Nodes       | ✔                 | ✔                  |
|                      | Agent Runs in Serverless K8s Pods         | ✔                 | ✔                  |
|                      | Agent Runs on Serverless K8s Nodes        |                   | ✔                  |
|                      | Agent Runs on Linux Servers               | ✔                 | ✔                  |
|                      | Agent Runs on Windows Servers             |                   | ✔                  |
|                      | Agent Runs on Android Devices             |                   | ✔                  |
|                      | Agent Runs on KVM/HyperV/ESXi/Xen         |                   | ✔                  |
|                      | Agent Runs in DPDK Data Plane Environment |                   | ✔                  |
|                      | Agent Runs on Dedicated Servers to Collect Mirror Traffic | | ✔ |
| Advanced Feature     | Cloud Network Traffic Distribution (NPB)  |                   | ✔                  |
|                      | Unified Management Across Multiple Regions | | ✔ |
|                      | Multi-Tenant and Permission Isolation     |                   | ✔                  |
|                      | Encrypted Transmission                    |                   | ✔                  |
|                      | Agent Registration Security Confirmation  |                   | ✔                  |
| Advanced Service     | Industry Observability Solutions          |                   | ✔                  |
|                      | Enterprise-Level After-Sales Support      |                   | ✔                  |