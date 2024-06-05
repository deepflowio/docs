---
title: DeepFlow Product
permalink: /about/editions
---

> This document was translated by ChatGPT

# Community Edition

The DeepFlow Community Edition is an open-source version, a highly automated observability `data platform`.
Its core is licensed under Apache 2.0, and the frontend is entirely based on Grafana, thus adopting an AGPL license.
It includes essential features for efficiently building observability, including:

- Universal Map (AutoMetrics)
  - Automatically collects application, network, and system full-stack performance metrics based on eBPF/cBPF
  - Automatically collects TCP/UDP flow logs based on eBPF/cBPF
  - Automatically collects application call logs for HTTP1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, bRPC, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, AMQP (RabbitMQ), OpenWire (ActiveMQ), NATS, Pulsar, ZMTP (ZeroMQ), RocketMQ, DNS, etc., based on eBPF/cBPF
- Distributed Tracing (AutoTracing)
  - Automatically traces microservice distributed call chains based on eBPF/cBPF
- Continuous Profiling (AutoProfiling)
  - Supports zero-intrusion OnCPU continuous profiling based on eBPF
  - Supports JVM languages, compiled languages like C/C++/Golang/Rust
- Integration
  - Integrates Prometheus/Telegraf metrics data to solve data silos and high cardinality issues
  - Integrates OpenTelemetry/SkyWalking tracing data for full-stack distributed tracing
  - Integrates Vector log data to solve data silos and resource consumption issues
- AutoTagging
  - Supports syncing public cloud resource tags and automatically injecting them into all observability data
  - Supports syncing container resource tags and custom labels and automatically injecting them into all observability data
  - Supports SmartEncoding for high-performance data tag storage
- Integration and Management
  - Supports displaying metrics and tracing data using Grafana
  - Supports unified monitoring of multiple K8s clusters and regular cloud servers
  - Collection agents can run on K8s nodes, Serverless Pods, and Linux Hosts
  - Supports deployment under X86 and ARM architectures

# Enterprise Edition

The DeepFlow Enterprise Edition is a highly automated `one-stop` observability `analysis platform`,
featuring enterprise-level visualization and management interfaces, complete data analysis capabilities, and enhanced data governance capabilities.
In addition to all the features of the Community Edition, it also includes:

- More powerful AutoMetrics, AutoTracing, AutoProfiling data
  - Supports collecting application call logs for TLS, Oracle, etc., and supports TCP stream reassembly based on eBPF/cBPF
  - Supports zero-intrusion OffCPU, Memory, GPU continuous profiling based on eBPF, and supports interpreted languages like Python
  - Supports TCP packet-by-packet sequence diagrams and raw packet network profiling capabilities based on cBPF
  - Agents can run on multi-tenant Serverless K8s nodes, Android devices, and Windows Hosts
  - Agents can run on KVM/HyperV/ESXi/Xen host environments
  - Agents can run on hosts and physical servers using the DPDK data plane
  - Agents can run on dedicated servers to collect and analyze mirrored traffic from physical switches, analyzing the performance of traditional four-seven layer gateways and proprietary cloud four-seven layer gateways
  - Agents can run on dedicated servers to collect NetFlow, sFlow data from physical switches
- AutoTagging
  - Deep integration with proprietary cloud products, including mainstream cloud platforms like Alibaba Cloud, Tencent Cloud, Huawei Cloud, etc.
- Analytical Capabilities
  - Supports correlation queries and automatic jumps of metrics, tracing, and log data
  - Supports one-stop alerting, reporting, custom Dashboard, and other multi-team collaborative features
- Advanced Features
  - Supports on-demand configuration of traffic filtering policies and distributing traffic to security, network, audit, and other traffic-consuming tools
  - Supports providing services for multiple tenants and data permission isolation
  - Supports encrypted data transmission between Agents and Servers
  - Supports unified monitoring of proprietary cloud, public cloud, and container resources across multiple regions
- Enterprise-level Services
  - Provides comprehensive cloud-native observability construction solutions for industries such as finance, energy, telecommunications (IT, 5GC), and IoV (Internet of Vehicles)
  - Provides enterprise-level after-sales support services, including troubleshooting, performance tuning, version upgrades, and best practice implementations for observability

# Cloud Edition

The DeepFlow Cloud Edition is a fully managed one-stop observability platform,
featuring the same functionalities as the Enterprise Edition, currently in the testing trial phase.

# Comparison of Edition Features

| Module               | <center>Supported Capability</center>                                           | Community Edition | Enterprise Edition |
| -------------------- | :------------------------------------------------------------------------------ | ----------------- | ------------------ |
| Universal Map        | eBPF/cBPF AutoMetrics                                                           | ✔                 | ✔                  |
|                      | Application protocol parsing - TLS, Oracle                                      |                   | ✔                  |
|                      | Application protocol parsing - Others                                           | ✔                 | ✔                  |
|                      | Enhanced protocol parsing capability based on TCP stream reassembly             |                   | ✔                  |
|                      | Wasm/so protocol parsing plugin SDK                                             | ✔                 | ✔                  |
|                      | Application performance metrics - Process/Container/Cloud Server                | ✔                 | ✔                  |
|                      | Application performance metrics - Host/Proprietary Cloud Gateway/Network Device |                   | ✔                  |
|                      | Network performance metrics - Process/Container/Cloud Server                    | ✔                 | ✔                  |
|                      | Network performance metrics - Host/Proprietary Cloud Gateway/Network Device     |                   | ✔                  |
|                      | Network performance metrics - NetFlow/sFlow                                     |                   | ✔                  |
|                      | Database performance metrics - Process/Container/Server                         | ✔                 | ✔                  |
|                      | Database performance metrics - Host/Proprietary Cloud Gateway                   |                   | ✔                  |
|                      | Application call logs - Process/Container/Server                                | ✔                 | ✔                  |
|                      | Application call logs - Host/Proprietary Cloud Gateway/Network Device           |                   | ✔                  |
|                      | Network flow logs - Process/Container/Server                                    | ✔                 | ✔                  |
|                      | Network flow logs - Host/Proprietary Cloud Gateway/Network Device               |                   | ✔                  |
|                      | Network flow logs - NetFlow/sFlow                                               |                   | ✔                  |
| Distributed Tracing  | eBPF/cBPF AutoTracing                                                           | ✔                 | ✔                  |
|                      | Enhancing AutoTracing using X-Request-ID                                        | ✔                 | ✔                  |
|                      | Enhancing AutoTracing using MySQL Comment                                       | ✔                 | ✔                  |
|                      | Enhancing AutoTracing using APM TraceID                                         | ✔                 | ✔                  |
|                      | Wasm/so AutoTracing enhancement plugin SDK                                      | ✔                 | ✔                  |
|                      | Integrating APM Span - OpenTelemetry/SkyWalking                                 | ✔                 | ✔                  |
|                      | eBPF Span - kprobe/uprobe                                                       | ✔                 | ✔                  |
|                      | cBPF Span - Container/Cloud Server                                              | ✔                 | ✔                  |
|                      | cBPF Span - Host/Proprietary Cloud Gateway/Network Device                       |                   | ✔                  |
|                      | Proprietary Cloud Gateway intelligent NAT tracing                               |                   | ✔                  |
| Continuous Profiling | eBPF AutoProfiling - OnCPU                                                      | ✔                 | ✔                  |
|                      | eBPF AutoProfiling - OffCPU                                                     |                   | ✔                  |
|                      | eBPF AutoProfiling - Memory                                                     |                   | ✔                  |
|                      | eBPF AutoProfiling - GPU                                                        |                   | ✔                  |
|                      | JVM languages AutoProfiling                                                     | ✔                 | ✔                  |
|                      | C/C++/Golang/Rust languages AutoProfiling                                       | ✔                 | ✔                  |
|                      | Python languages AutoProfiling                                                  |                   | ✔                  |
|                      | AutoProfiling for processes without symbol tables                               |                   | ✔                  |
|                      | TCP packet-by-packet sequence diagrams (Network Profiling)                      |                   | ✔                  |
|                      | Packet backtracking (Network Profiling)                                         |                   | ✔                  |
| Event                | eBPF AutoEvents                                                                 | ✔                 | ✔                  |
|                      | Linux file read/write AutoEvents                                                | ✔                 | ✔                  |
|                      | Cloud resource, container resource change events                                | ✔                 | ✔                  |
| AutoTagging          | SmartEncoding                                                                   | ✔                 | ✔                  |
|                      | K8s container resources, custom label tags                                      | ✔                 | ✔                  |
|                      | K8s custom annotation/env tags                                                  |                   | ✔                  |
|                      | Public cloud resource tags                                                      | ✔                 | ✔                  |
|                      | Public cloud custom business tags                                               |                   | ✔                  |
|                      | Private/Proprietary cloud resource tags                                         |                   | ✔                  |
|                      | Private/Proprietary cloud custom business tags                                  |                   | ✔                  |
|                      | Provides API for injecting CMDB business tags                                   | ✔                 | ✔                  |
|                      | Provides plugin mechanism for injecting process business tags                   | ✔                 | ✔                  |
| Integration          | Integrates Prometheus/Telegraf metrics data                                     | ✔                 | ✔                  |
|                      | Integrates OpenTelemetry/SkyWalking tracing data                                | ✔                 | ✔                  |
|                      | Integrates Pyroscope continuous profiling data                                  | ✔                 | ✔                  |
|                      | Integrates Vector log data                                                      | ✔                 | ✔                  |
|                      | Provides SQL, PromQL API                                                        | ✔                 | ✔                  |
|                      | Provides Grafana Datasource and Panel                                           | ✔                 |                    |
|                      | Uses Grafana Tempo for displaying distributed tracing data                      | ✔                 |                    |
|                      | Outputs tracing data to SkyWalking                                              | ✔                 | ✔                  |
|                      | Outputs tracing data to OpenTelemetry Collector                                 | ✔                 | ✔                  |
|                      | Outputs metrics/tracing/events data to Kafka                                    | ✔                 | ✔                  |
|                      | Outputs metrics data to Prometheus                                              | ✔                 | ✔                  |
| Analytics            | Enterprise-level observability analysis platform                                |                   | ✔                  |
|                      | Custom Dashboard management                                                     |                   | ✔                  |
|                      | Alert management                                                                |                   | ✔                  |
|                      | Report management                                                               |                   | ✔                  |
| Compatibility        | Agent/Server runs on X86/ARM servers                                            | ✔                 | ✔                  |
|                      | Agent runs on proprietary K8s nodes                                             | ✔                 | ✔                  |
|                      | Agent runs inside Serverless K8s Pods                                           | ✔                 | ✔                  |
|                      | Agent runs on Serverless K8s nodes                                              |                   | ✔                  |
|                      | Agent runs on Linux servers                                                     | ✔                 | ✔                  |
|                      | Agent runs on Windows servers                                                   |                   | ✔                  |
|                      | Agent runs on Android devices                                                   |                   | ✔                  |
|                      | Agent runs on KVM/HyperV/ESXi/Xen                                               |                   | ✔                  |
|                      | Agent runs on DPDK data plane environments                                      |                   | ✔                  |
|                      | Agent runs on dedicated servers to collect mirrored traffic                     |                   | ✔                  |
| Advanced Feature     | Cloud network traffic distribution (NPB)                                        |                   | ✔                  |
|                      | Unified management of multiple regions                                          |                   | ✔                  |
|                      | Multi-tenant and permission isolation                                           |                   | ✔                  |
|                      | Encrypted transmission                                                          |                   | ✔                  |
|                      | Agent registration security confirmation                                        |                   | ✔                  |
| Advanced Service     | Industry-specific observability solutions                                       |                   | ✔                  |
|                      | Enterprise-level after-sales support                                            |                   | ✔                  |
