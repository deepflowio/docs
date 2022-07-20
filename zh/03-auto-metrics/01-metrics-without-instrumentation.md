---
title: 零侵扰的指标采集
---

# 简介

以往我们一般通过 SDK、字节码增强或手动埋点方式主动插入统计代码，这给应用开发者带来了沉重的负担，他们需要适配各种开发语言、各类 RPC 框架，高速的业务迭代也使得开发者经常在处理故障时才发现尚未给服务增加必要的性能指标。另外，诸如 Nginx、MySQL 等基础服务的运维人员更为被动，他们只能期待基础服务软件已经暴露了关键的性能指标。

DeepFlow 基于 BPF 的 **AutoMetrics** 能力可自动获取每一个微服务的 API 调用在应用函数、系统函数和网络通信等全栈路径上的黄金性能指标，并通过 BPF 和 AF\_PACKET/winpcap 将这些能力扩展到更广泛的 Linux 内核版本及 Windows 操作系统。

目前，DeepFlow 已经通过 eBPF 支持了主流应用协议的解析，包括 HTTP 1/2/S、Dubbo、MySQL、Redis、Kafka、MQTT、DNS，未来还将扩展更多应用协议的支持。基于 DeepFlow 的 AutoMetrics 能力，能够零侵扰的获取应用的 RED（Request、Error、Delay）指标、网络协议栈的吞吐、时延、建连异常、重传、零窗等指标。DeepFlow Agent 会维护每个 TCP 连接、每个应用协议 Request 的会话状态，称之为 `Flow`。所有原始性能指标数据精细至 Flow 粒度，并额外自动聚合为 1s、1min 指标数据。基于这些指标数据，我们可呈现任意服务、工作负载、API 的全栈性能数据，并可绘制任意服务之间的调用关系拓扑图 —— `Universal Service Map`。

# 指标类型

- [应用性能指标](./application-metrics/)
- [应用调用详情](./request-log/)
- [网络性能指标](./network-metrics/)
- [网络流日志](./flow-log/)

为了更加直观的感受 AutoMetrics 的能力，如果你运行 DeepFlow 的环境中还没有业务流量，
建议首先参考[基于 OpenTelemetry WebStore Demo 体验 - 部署 Demo](../agent-integration/tracing/opentelemetry/#部署-demo-2) 章节部署一个 OpenTelemetry 官方的微服务 Demo 应用，
这个 Demo 由 Go、C#、Node.js、Python、Java 等语言实现的十多个微服务组成。特别说明一下，在本章节中我们展示的所有指标数据对 OpenTelemetry `没有任何依赖`。

# 统计位置说明

DeepFlow 通过 cBPF/eBPF 自动采集各个位置的指标数据，为了区分这些数据的采集位置，我们使用 `tap_side` 标签对数据进行标注。

cBPF 采集到的数据，`tap_side` 取值的含义如下：
| 数据源类型 | `tap_side` 取值 | 数据采集位置         |
| ---------- | --------------- | -------------------- |
| cBPF       | c               | 客户端网卡           |
| cBPF       | c-nd            | 客户端容器节点       |
| cBPF       | c-hv            | 客户端宿主机         |
| cBPF       | c-gw-hv         | 客户端到网关宿主机   |
| cBPF       | c-gw            | 客户端到网关         |
| cBPF       | local           | 本机网卡             |
| cBPF       | rest            | 其他网卡             |
| cBPF       | s-gw            | 网关到服务端         |
| cBPF       | s-gw-hv         | 网关宿主机到服务端   |
| cBPF       | s-hv            | 服务端宿主机         |
| cBPF       | s-nd            | 服务端容器节点       |
| cBPF       | s               | 服务端网卡           |

eBPF 采集到的数据，`tap_side` 取值的含义如下：
| 数据源类型 | `tap_side` 取值 | 数据采集位置         |
| ---------- | --------------- | -------------------- |
| eBPF       | c-p             | 客户端进程           |
| eBPF       | s-p             | 服务端进程           |

除此之外，[集成 OpenTelemetry 数据](../agent-integration/tracing/opentelemetry/)后，我们也会注入 `tap_side` 标签，取值含义如下：
| 数据源类型 | `tap_side` 取值 | 数据采集位置         |
| ---------- | --------------- | -------------------- |
| OTel       | c-app           | 客户端应用，对应 `span.spankind = SPAN_KIND_CLIENT, SPAN_KIND_PRODUCER` |
| OTel       | s-app           | 服务端应用，对应 `span.spankind = SPAN_KIND_SERVER, SPAN_KIND_CONSUMER` |
| OTel       | app             | 应用，对应其他 spankind |
