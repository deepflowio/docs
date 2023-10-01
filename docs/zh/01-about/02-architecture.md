---
title: DeepFlow 架构
permalink: /about/architecture
---

# 软件架构

DeepFlow 主要由 Agent 和 Server 两个组件构成。Agent 以各种形态广泛运行于 Serverless Pod、K8s Node、云服务器、虚拟化宿主机等环境中，采集这些环境中所有应用进程的观测数据。Server 运行在一个 K8s 集群中，提供 Agent 管理、数据标签注入、数据写入、数据查询等服务。

![DeepFlow 社区版软件架构](./imgs/deepflow-architecture.png)

DeepFlow 企业版拥有更多的软件组件，以提供更加完善的数据分析、全栈及多区域数据管理、告警管理、报表管理、视图管理、租户管理能力。

# 设计理念

DeepFlow 的名称来自于我们对实现可观测性的认知：**对每一次应用调用（Flow）的深度（Deep）洞察**。DeepFlow 中的所有可观测性数据都是以调用为核心组织的：原始的调用日志、聚合生成的应用性能指标和服务全景图、关联生成的分布式追踪火焰图，以及在每一个调用生命周期内的网络性能指标、文件读写性能指标、函数调用栈性能剖析等。我们认识到这些可观测性数据在采集和关联上的困难，使用 eBPF 技术实现了零侵扰（Zero Code）的数据采集，并利用智能编码（SmartEncoding）机制实现了所有数据的全栈（Full Stack）关联。

![DeepFlow 基于 eBPF 技术实现零侵扰的全栈数据采集](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091164febaf0c68bc.png)

除了能够利用 eBPF 技术零侵扰采集观测数据以外，DeepFlow 还支持集成主流的可观测性技术栈，例如支持作为 Prometheus、OpenTelemetry、SkyWalking、Pyroscope 等技术栈的存储后端，并提供 SQL、PromQL、OTLP Export 能力作为 Grafana、Prometheus、OpenTelemetry、SkyWalking 的数据源，使得开发者可以快速将其融入到自己的可观测性解决方案中。当作为存储后端时，DeepFlow 并不只是简单的存储数据，利用领先的 AutoTagging 和 SmartEncoding 机制，高性能、自动化的为所有观测信号注入统一的属性标签，消除数据孤岛，并增强数据的下钻切分能力。

# DeepFlow Agent

DeepFlow Agent 使用 Rust 语言实现，有着极致的处理性能和内存安全性。

Agent 采集的数据包括如下三类：
- **eBPF 观测信号**
  - **AutoMetrics**
    - 基于 eBPF（Linux Kernel 4.14+）采集所有服务的全栈 RED 黄金指标
    - 基于 cBPF（Linux Kernel 2.6+）、Winpcap（Windows 2008+）采集所有服务的全栈 RED 黄金指标、网络性能指标
  - **AutoTracing**
    - 基于 eBPF（Linux Kernel 4.14+）分析 Raw Request 数据的关联性，计算分布式调用链
    - 基于 cBPF（Linux Kernel 2.6+）数据，编写 Wasm Plugin 解析业务流水号以关联 Raw Request 数据，计算分布式调用链
  - **AutoProfiling**
    - 基于 eBPF（Linux Kernel 4.9+）采集函数粒度的持续性能剖析数据，并与分布式追踪数据自动关联
    - 基于 cBPF（Linux Kernel 2.6+）、Winpcap（Windows 2008+）分析网络包时序，生成网络性能剖析数据以推断应用性能瓶颈
- 插桩观测信号：收集主流开源 Agent、SDK 的观测数据，例如 Prometheus、OpenTelemetry、SkyWalking、Pyroscope 等
- 标签数据：同步云 API、K8s apiserver、和 CMDB 中的资源和服务信息，用于为所有观测信号注入统一标签

此外，Agent 支持基于 WASM 向开发者提供可编程接口，用于解析 Agent 尚未识别的应用协议，以及构建面向具体场景的业务分析能力。

Agent 支持运行于各种工作负载环境中：
- 以进程形态运行于 Linux/Windows 服务器中，采集服务器中所有进程的观测数据
- 以独立 Pod 形态运行于每个 K8s Node 中，采集 K8s Node 中所有 Pod 的观测数据
- 以 Sidecar 形态运行于每个 K8s Pod 中，采集 Pod 中所有 Container 的观测数据
- 以进程形态运行于 Android 终端设备操作系统中，采集终端设备中所有进程的观测数据
- 以进程形态运行于 KVM、Hyper-V 等宿主机中，采集所有虚拟机的观测数据
- 以进程形态运行于独占的虚拟机上，采集并分析来自 VMware VSS/VDS 的镜像网络流量
- 以进程形态运行于独占的物理机上，采集并分析来自物理交换机的镜像网络流量

# DeepFlow Server

DeepFlow Server 使用 Golang 实现，由 Controller、Labeler、Ingester、Querier 等模块组成：
- Controller：管理 Agent、均衡调度 Agent 与 Server 的通信关系、同步 Agent 收集的 Tag 数据。
- Labeler：为所有观测信号计算统一的属性标签。
- Ingester：向 ClickHouse 中存储观测数据，向 otel-collector 导出观测数据。
- Querier：观测数据查询，提供统一的 SQL/PromQL 接口查询所有类型的观测数据。

DeepFlow 的标签注入机制有两个特点：
- **AutoTagging**：自动为所有观测数据注入统一的属性标签，包括云资源属性、容器资源属性、K8s Label/Annotation/Env、CMDB 中的业务属性等，消除数据孤岛，增强数据的下钻切分能力
- **SmartEncoding**：仅向数据中注入少量预先编码的元标签（Meta Tag），其余绝大多数标签（Custom Tag）与观测信号分离存储。通过自动的关联查询机制，使得用户获得直接在大宽表（BigTable）上查询的体验。在生产环境中的实际运行数据表明 SmartEncoding 可将标签存储开销降低一个数量级。

![Server 的多集群、多区域管理能力](./imgs/multi-cluster-and-multi-region.png?align=center)

DeepFlow Server 以 Pod 形态运行在 K8s 集群中，支持水平扩展。Server 集群能够自动根据 Agent 的数据均衡调度 Agent 与 Server 之间的通信关系。一个 Server 集群可管理多个异构资源池中的 Agent。企业版支持多 Region 统一管理。
