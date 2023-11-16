---
title: DeepFlow Architecture
permalink: /about/architecture
---

> This document was translated by GPT-4

# Software Architecture

DeepFlow mainly consists of two components: Agent and Server. The Agent runs extensively in various environments like Serverless Pod, K8s Node, cloud servers, virtual hosts, etc., collecting observable data from all application processes in these environments. The Server, running in a K8s cluster, provides services like agent management, data tagging, data writing, data querying, and more.

![DeepFlow Community Edition Software Architecture](./imgs/deepflow-architecture.png)

DeepFlow Enterprise Edition possesses more software components to enhance data analytics, full-stack cross-regional data management, alert management, report management, view management, and tenant management capabilities.

# Design Philosophy

The name DeepFlow comes from our understanding of achieving observability: **a deep insight into every application call (Flow)**. All observable data in DeepFlow are organized around the call. These data include original call logs, aggregated performance metrics and a universal service map created from the applications, related distributed tracing flame graphs, as well as network performance metrics, file read/write performance metrics, function call stack performance profiling within each lifecycle of a call. Recognizing the complexities of collecting and correlating these observability data, we use eBPF technology for zero-intrusion (Zero Code) data collection, and our SmartEncoding mechanism brings full-stack data correlation.

![DeepFlow: Zero-Intrusion Full-Stack Data Collection using eBPF Technology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202311046546371f08829.png)

Apart from utilizing eBPF technology for zero-intrusion data collection, DeepFlow also supports the integration of mainstream observability tech stacks. It can function as a storage backend for Prometheus, OpenTelemetry, SkyWalking, Pyroscope and more, providing SQL, PromQL, OTLP Export capabilities to serve as data sources for Grafana, Prometheus, OpenTelemetry, SkyWalking. This enables developers to quickly integrate it into their observability solutions. When serving as a storage backend, DeepFlow does more than just storing data. Using its advanced AutoTagging and SmartEncoding mechanisms, it injects unified attribute tags into all observability signals, eliminating data silos, and enhancing data drill-down capabilities.

# DeepFlow Agent

Implemented in Rust language, DeepFlow Agent offers exceptional processing performance and memory safety.

The data collected by the Agent can be classified into three categories:

- **eBPF Observability Signals**
  - **AutoMetrics**
    - Using eBPF (Linux Kernel 4.14+) to collect full-stack RED golden metrics of all services
    - Using cBPF (Linux Kernel 2.6+), Winpcap (Windows 2008+) to collect the full-stack RED golden metrics and network performance metrics of all services
  - **AutoTracing**
    - Using eBPF (Linux Kernel 4.14+), analyses the correlation of Raw Request data, and calculates the distributed tracing
    - With cBPF data (Linux Kernel 2.6+), writing Wasm Plugin to parse the business running numbers associated with Raw Request data for calculating distributed tracing
  - **AutoProfiling**
    - Based on eBPF (Linux Kernel 4.9+), collects function-level continuous profiling data and automatically associates it with distributed tracing data
    - With cBPF data (Linux Kernel 2.6+), Winpcap (Windows 2008+), analyses network packet sequence, generating network performance profiling data to deduce application performance bottlenecks
- Instrumentation Observability Signals: Collects observability data from leading open-source Agents, SDKs, such as Prometheus, OpenTelemetry, SkyWalking, Pyroscope, etc.
- Tag Data: Synchronizes resource and service information from Cloud APIs, K8s apiserver, CMDB, etc., for injecting unified tags into all observability signals.

Besides, the Agent offers a programmable interface based on WASM to developers for parsing those application protocols which the Agent has not yet recognized, and for building business analysis capabilities targeted at specific scenarios.

Agent runs in various workload environments in the following ways:

- As a process on Linux/Windows servers, collects observability data from all processes in the server
- As an independent Pod on each K8s Node, collects observability data from all Pods on the K8s Node
- As a Sidecar running on each K8s Pod, collecting observability data from all Containers in the Pod
- Runs in Android terminal device operating systems to collect observability data from all processes in the terminal
- As a process running on hosts like KVM, Hyper-V, etc., collects observability data from all virtual machines
- Runs on an exclusive virtual machine to collect and analyze the mirrored network traffic from VMware VSS/VDS
- Runs on a dedicated physical machine to collect and analyze mirrored network traffic from physical switches

# DeepFlow Server

Implemented in Golang, DeepFlow Server consists of modules like Controller, Labeler, Ingester, Querier, etc.:

- Controller: Manages Agents, balances the communication relationship between Agents and Servers, syncs Tag data collected by Agents.
- Labeler: Calculates unified attribute tags for all observability signals.
- Ingester: Stores observability data in ClickHouse, exports observability data to otel-collector.
- Querier: Queries observability data, offers unified SQL/PromQL interface to query all types of observability data.

The tagging mechanism of DeepFlow features:

- **AutoTagging**: Automatically injects unified attribute tags into all observability data including cloud resource attributes, container resource attributes, K8s Label/Annotation/Env, business attributes in CMDB, eliminating data silos and enhancing data drill-down capabilities.
- **SmartEncoding**: Only injects a few pre-encoded meta tags into the data, the vast majority of the tags (Custom Tag) are stored separately from the observability signals. This automatic association query mechanism provides users the experience of directly querying on a BigTable. The real-world data shows that SmartEncoding can reduce the storage cost of tags by an order of magnitude.

![Server's Multi-Cluster, Multi-Region Management Capabilities](./imgs/multi-cluster-and-multi-region.png?align=center)

DeepFlow Server runs in the form of a Pod in a K8s cluster and supports horizontal expansion. The Server cluster can automatically balance the communication relationship between Agents and Servers according to the data from the Agents. One Server cluster can manage Agents in multiple heterogeneous resource pools. The Enterprise Edition supports unified management across multiple Regions.
