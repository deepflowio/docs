---
title: DeepFlow Architecture
permalink: /about/architecture
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

# Software Architecture

DeepFlow consists of two processes, Agent and Server. An Agent runs in each K8s node, virtual machine and physical bare metal, and is responsible for AutoMetrics and AutoTracing data collection of all application processes on the server. Server runs in a K8s cluster and provides Agent management, data tag injection, data writing and data query services.

![DeepFlow Architecture](./imgs/deepflow-architecture.png)

# Design Principle

The DeepFlow name comes from the **automated** collection capability of **Flow**. The Flow in the network corresponds to a TCP/IP quintuple, and the Flow in the application corresponds to an application Request. DeepFlow uses eBPF and other technologies to automatically obtain Request-scoped data of any software technology stack, including Request-scoped events in the form of Raw data, Rquest-scoped metrics formed after aggregation, and Trace built after correlation. These data are often used to draw raw request tables, service call topologies, and distributed call flame graphs.

In addition to automatically obtaining Request-scoped observation data, DeepFlow integrates a large number of other open source SDKs and Agent data sources through the open capabilities of the Agent, completely covering the three pillars of Tracing, Metrics, and Logging of observability. DeepFlow does not simply incorporate these data. The unique AutoTagging and SmartEncoding technologies can inject unified attribute tags into all observation data with high performance and automation, eliminate data silos, and release data drill-down and segmentation capabilities.

![DeepFlow Design Principle](./imgs/deepflow-location.png?w=796&align=center)

# DeepFlow Agent

DeepFlow Agent is implemented in Rust language, with extreme processing performance and memory safety.

The data collected by the Agent includes three categories:
- eBPF data
  - The **AutoMetrics** mechanism based on eBPF (Linux Kernel 4.14+) collects the RED performance metrics of any application Request
  - The **AutoMetrics** mechanism based on BPF, AF\_PACKET (Linux Kernel 2.6+), and winpcap (Windows 2008+) collects the RED performance indicators, network throughput, delay, performance, and abnormal performance indicators of any application Request
  - Based on the **AutoTracing** mechanism of eBPF (Linux Kernel 4.14+), analyze the correlation of Raw Request data and build a distributed call chain
- Integrated observation data: Receive observation data from other open source agents and SDKs
- Tag data: Automatically synchronize service, instance and API attribute information in K8s apiserver and service registry

Agent supports running in various workload environments:
- It runs in the K8s Node in the form of Daemonset Pod, and collects the data of all Pods in the Node.
- It runs in the Linux server in the form of a process, and collects the data of all processes in the server
- It runs in Windows server as a process and collects data of all processes in the server [^1]
- It runs in the Serverless Pod in the form of Sidecar, and collects the data of all Containers in the Pod [^1]

In addition, Agent supports to provide developers with a programmable interface [^1] based on WASM, which is used to parse application protocols that the Agent has not yet identified, and to build business analysis capabilities for specific scenarios.

[^1]: Milestone features.

# DeepFlow Server

DeepFlow Server is implemented in Golang and consists of four modules: Controller, Labeler, Ingester, and Querier:
- Controller: manages the agent, balances the communication relationship between the agent and the server, and synchronizes the tag data discovered by the collector.
- Labeler: Inject uniform attribute labels into observation data.
- Ingester: Observation data storage, plug-in mechanism supports replacement of analysis database.
- Querier: Observation data query, providing a unified SQL interface to query all types of observation data.

There are two key features of DeepFlow:
- **AutoTagging**: Automatically inject unified attribute tags for all observation data, eliminate the problem of data islands, and release the ability to drill down and segment data
- **SmartEncoding**: Using distributed encoding technology, attribute tags are encoded into integer values, and shaped tags are directly injected in the tag injection stage. The actual operation data in the production environment shows that SmartEncoding can improve tag storage performance by an order of magnitude.

DeepFlow Server runs in the K8s cluster in the form of Pod and supports horizontal expansion. The server cluster can automatically schedule the communication relationship between the agent and the server according to the data of the agent. A server cluster can manage agents in multiple heterogeneous resource pools, and supports unified management across regions.

![Multi-luster and Multi-region](./imgs/multi-cluster-and-multi-region.png)

The analysis database used by DeepFlow is replaceable. Currently, we provide ClickHouse as the default option, and will add support for more databases in the future. In addition, we plan to support the storage of different data in different databases to give full play to the advantages of different databases.

DeepFlow provides a unified SQL query interface and provides data capabilities based on Grafana by default. Developers can choose to visualize data through Grafana, or they can choose to integrate DeepFlow into their own observability platform. In addition, we also plan to develop mainstream QL dialects on top of SQL, such as PromQL, so that users can seamlessly migrate data to DeepFlow.
