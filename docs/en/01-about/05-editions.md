> This document was translated by GPT-4

---

title: DeepFlow Product
permalink: /about/editions

---

# Community Edition

The DeepFlow Community Edition is an open-source version and a highly automated observability data platform. Its core uses the Apache 2.0 license, and its frontend is entirely based on Grafana, so it uses the AGPL license. It has all the common features necessary for efficient construction of observability, including:

- Universal Map(AutoMetrics)
  - Based on eBPF/cBPF, it automatically collects application, network, and system stack performance metrics
  - Based on eBPF/cBPF, it automatically collects TCP/UDP stream logs
  - Based on eBPF/cBPF, it automatically collects HTTP1/2, HTTPS(Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, DNS, and other application call logs
- Distributed Tracing(AutoTracing)
  - It traces microservices distributed call chains based on eBPF/cBPF
- Integration
  - It integrates metrics data from Prometheus/Telegraf, solving data isolation and high cardinality problems
  - It integrates tracing data from OpenTelemetry/SkyWalking, realizing full-stack distributed tracing
- AutoTagging
  - It supports the synchronizing of public cloud resource tags and auto-injects them into all observing data
  - It supports synchronizing container resource tags and custom Labels, and auto-injects them into all observing data
  - It supports SmartEncoding for high-performance data tag storage
- Integration and Management
  - It supports using Grafana to display metrics and tracing data
  - It supports unified monitoring of multiple K8s clusters and ordinary cloud servers
  - The collection Agent supports running in K8s nodes, Serverless Pods, and Linux Host environments
  - It supports deployment under the X86, ARM architecture

# Enterprise Edition

The DeepFlow Enterprise Edition is a highly automated one-stop observability analysis platform, which has enterprise-level visualization and management interfaces, complete data analysis capabilities, and enhanced data governance capabilities. Besides all the functions of the community edition, it also has the following features:

- More abundant AutoMetrics and AutoTracing data
  - The Agent supports running on multi-tenant Serverless K8s nodes and Windows Hosts
  - The Agent supports running in environments of KVM/HyperV/ESXi/Xen host machines
  - The Agent supports running on host machines and physical servers that use DPDK data planes
  - The Agent supports running on dedicated servers to collect and analyze mirror traffic from physical switches and analyze the performance of traditional four-seven layer gateways and proprietary cloud four-seven layer gateways
  - The Agent supports running on dedicated servers to collect NetFlow/sFlow data from physical switches
- Continuous Profiling(AutoProfiling)
  - Supports zero-disturbance continuous performance profiling based on eBPF
  - Supports network profiling capabilities such as TCP packet-by-packet timing diagrams and original Packets based on cBPF
- AutoTagging
  - It deeply adapts to proprietary cloud products, including major cloud platforms such as Alibaba Cloud, Tencent Cloud, and Huawei Cloud, etc.
- Analysis Capability
  - Supports related queries and automatic jumps of metric, tracing, and log data
  - Supports one-stop alarms, reports, custom views, and other multi-team collaboration features
- Advanced Features
  - Supports setting traffic filtering policies as needed, distributing traffic to security, network, audit, and other traffic consumption tools
  - Supports multi-tenant services and data permission isolation
  - Supports encrypted data transmission between Agent and Server
  - Supports unified monitoring of proprietary cloud, public cloud, and container resources across multiple regions
- Enterprise-level Service
  - Provides complete observability construction solutions for industries such as finance, energy, operators (IT, 5GC), and vehicle networking
  - Provides enterprise-level after-sales support services, including troubleshooting, performance tuning, version upgrades, and implementation of observability best practices

# Cloud Edition

The DeepFlow Cloud Edition is a fully-hosted one-stop observability platform, which has the same functions as the enterprise edition. It is currently in the test trial stage.

# Version Value Comparison

| Module               | <center>Support Capability</center>                                                   | Community Edition | Enterprise Edition |
| -------------------- | :------------------------------------------------------------------------------------ | ----------------- | ------------------ |
| Universal Map        | eBPF/cBPF AutoMetrics                                                                 | ✔                 | ✔                  |
|                      | Application Performance Indicators - Processes/Containers/Cloud Servers               | ✔                 | ✔                  |
|                      | Application Performance Indicators - Hosts/Proprietary Cloud Gateways/Network Devices |                   | ✔                  |
|                      | Network Performance Indicators - Processes/Containers/Cloud Servers                   | ✔                 | ✔                  |
|                      | Network Performance Indicators - Hosts/Proprietary Cloud Gateways/Network Devices     |                   | ✔                  |
|                      | Network Performance Indicators - NetFlow/sFlow                                        |                   | ✔                  |
|                      | Storage Performance Indicators - Processes/Containers/Servers                         | ✔                 | ✔                  |
|                      | Storage Performance Indicators - Hosts/Proprietary Cloud Gateways                     |                   | ✔                  |
|                      | Application Call Logs - Processes/Containers/Servers                                  | ✔                 | ✔                  |
|                      | Application Call Logs - Hosts/Proprietary Cloud Gateways/Network Devices              |                   | ✔                  |
|                      | Network Stream Logs - Processes/Containers/Servers                                    | ✔                 | ✔                  |
|                      | Network Stream Logs - Hosts/Proprietary Cloud Gateways/Network Devices                |                   | ✔                  |
|                      | Network Stream Logs - NetFlow/sFlow                                                   |                   | ✔                  |
|                      | Built-in Application Protocol Analysis - Open Standard Protocols                      | ✔                 | ✔                  |
|                      | Built-in Application Protocol Analysis - Closed Standard Protocols                    |                   | ✔                  |
|                      | Enhanced Protocol Analysis Capabilities Based on TCP Stream Reassembly                |                   | ✔                  |
|                      | Wasm/so Protocol Analysis Plug-in SDK                                                 | ✔                 | ✔                  |
| Distributed Tracing  | eBPF/cBPF AutoTracing                                                                 | ✔                 | ✔                  |
|                      | Enhanced AutoTracing Using X-Request-ID                                               | ✔                 | ✔                  |
|                      | Enhanced AutoTracing using MySQL Comment                                              | ✔                 | ✔                  |
|                      | Enhanced AutoTracing using Existing TraceID                                           | ✔                 | ✔                  |
|                      | Wasm/so AutoTracing Enhancement Plugin SDK                                            | ✔                 | ✔                  |
|                      | Integrated APM Span - OpenTelemetry/SkyWalking                                        | ✔                 | ✔                  |
|                      | eBPF Span - kprobe/uprobe                                                             | ✔                 | ✔                  |
|                      | cBPF Span - Containers/Cloud Servers                                                  | ✔                 | ✔                  |
|                      | cBPF Span - Hosts/Proprietary Cloud Gateways/Network Devices                          |                   | ✔                  |
|                      | Intelligent NAT Tracing                                                               |                   | ✔                  |
| Continuous Profiling | eBPF AutoProfiling                                                                    |                   | ✔                  |
|                      | Unsigned eBPF Profiling                                                               |                   | ✔                  |
|                      | TCP Packet-by-Packet Timing Diagram (Network Profiling)                               |                   | ✔                  |
|                      | Packet Retrospect (Network Profiling)                                                 |                   | ✔                  |
| AutoTagging          | SmartEncoding                                                                         | ✔                 | ✔                  |
|                      | K8s Container Resources, Custom Label Tags                                            | ✔                 | ✔                  |
|                      | K8s Custom Annotation/Env Tags                                                        |                   | ✔                  |
|                      | Public Cloud Resource Tags                                                            | ✔                 | ✔                  |
|                      | Custom Business Tags for Public Cloud                                                 |                   | ✔                  |
|                      | Private Cloud/Proprietary Cloud Resource Tags                                         |                   | ✔                  |
|                      | Custom Business Tags for Private/Proprietary Cloud                                    |                   | ✔                  |
|                      | API Support for Injecting CMDB Business Tags                                          | ✔                 | ✔                  |
|                      | Plug-in Mechanism Support for Injecting Process Business Tags                         | ✔                 | ✔                  |
| Integration          | Integration of Prometheus/Telegraf Metric Data                                        | ✔                 | ✔                  |
|                      | Integration of OpenTelemetry/SkyWalking Tracing Data                                  | ✔                 | ✔                  |
|                      | Integration of Pyroscope Continuous Performance Profiling Data                        |                   | ✔                  |
|                      | Providing SQL, PromQL API                                                             | ✔                 | ✔                  |
|                      | Providing OpenTelemetry OTLP Exporter API                                             | ✔                 | ✔                  |
|                      | Providing Grafana Datasource and Panel                                                | ✔                 |                    |
|                      | Using Grafana Tempo to Display Distributed Tracing Data                               | ✔                 |                    |
|                      | Outputting Tracing Data to SkyWalking                                                 | ✔                 | ✔                  |
| Analytics            | Enterprise Grade Observability Analysis Platform                                      |                   | ✔                  |
|                      | Custom View Management                                                                |                   | ✔                  |
|                      | Alarm Management                                                                      |                   | ✔                  |
|                      | Report Management                                                                     |                   | ✔                  |
| Compatibility        | Agent/Server Running on X86/ARM Servers                                               | ✔                 | ✔                  |
|                      | Agent Running on Proprietary K8s Nodes                                                | ✔                 | ✔                  |
|                      | Agent Running inside of Serverless K8s Pod                                            | ✔                 | ✔                  |
|                      | Agent Running on Serverless K8s Nodes                                                 |                   | ✔                  |
|                      | Agent Running on Linux Servers                                                        | ✔                 | ✔                  |
|                      | Agent Running on Windows Servers                                                      |                   | ✔                  |
|                      | Agent Running on Android Terminals                                                    |                   | ✔                  |
|                      | Agent Running on KVM/HyperV/ESXi/Xen                                                  |                   | ✔                  |
|                      | Agent Running in DPDK Data Plane Environments                                         |                   | ✔                  |
|                      | Agent Running on Dedicated Servers for Mirror Traffic Collection                      |                   | ✔                  |
| Advanced Feature     | Cloud Network Traffic Distribution (NPB)                                              |                   | ✔                  |
|                      | Multi-Region Unified Management                                                       |                   | ✔                  |
|                      | Multi-Tenant and Permission Isolation                                                 |                   | ✔                  |
|                      | Encrypted Transmission                                                                |                   | ✔                  |
|                      | Secure Agent Registration Confirmation                                                |                   | ✔                  |
| Advanced Service     | Observability Solutions for Various Industries                                        |                   | ✔                  |
|                      | Enterprise-level After-sales Service Support                                          |                   | ✔                  |
