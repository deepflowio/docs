---
title: DeepFlow 路标
permalink: /about/milestone
---

DeepFlow 目前（2023 年 9 月）已经迭代到了 v6.3.9，已支持的主要特性包括：
- Universal Map (AutoMetrics)
  - [x] 基于 cBPF 的 TCP 网络性能指标
  - [x] 基于 cBPF 的各类应用协议解析和性能分析能力
  - [x] 基于 eBPF tracepoint/kprobe 的各类应用协议解析和性能分析能力
  - [x] 基于 eBPF 的文件读写性能指标
  - [x] 基于 eBPF uprobe 的 Golang 应用 HTTP2、gRPC 协议解析和性能分析能力
  - [x] 基于 eBPF uprobe 的 Golang/openssl 应用 HTTPS 协议解析和性能分析能力
  - [x] 使用 Wasm、so 插件增强标准协议的解析能力，并可实现私有协议的解析
- Distributed Tracing (AutoTracing)
  - [x] 支持基于 eBPF 的零侵扰分布式追踪能力，支持任意应用同线程、Golang 应用跨协程调用链
  - [x] 使用 Wasm/so 插件提取业务流水号，实现仅依赖 cBPF 的零侵扰分布式追踪能力
  - [x] 支持解析请求中的 X-Request-ID 等字段追踪 ALB 前后的调用链
  - [x] 支持解析请求中的 MySQL Comment 字段追踪 MySQL 调用链
  - [x] 支持解析请求中的 TraceID/SpanID 等字段追踪跨线程的调用链
  - [x] 支持自动追踪网络转发路径，计算逐跳性能
- Continuous Profiling (AutoProfiling)
  - [x] 支持 eBPF 零侵扰采集 C/C++/Golang/Rust/Java 应用的 Profile 数据
  - [x] 支持 eBPF 零侵扰采集 OnCPU Profile
- AutoTagging & SmartEncoding
  - [x] 自动注入云资源标签、K8s 服务标签
  - [x] 自动注入 K8s Label/Annotation/Env 自定义标签
  - [x] 支持通过 API 注入 CMDB 中的业务标签
  - [x] 支持通过 Plugin 注入业务发布系统暴露的进程业务标签
  - [x] 高性能的 SmartEncoding 标签存储查询能力
- Integration
  - [x] 支持集成 Prometheus 和 Telegraf 的指标数据
  - [x] 支持集成 OpenTelemetry 和 SkyWalking 的追踪数据，并与 eBPF 追踪数据关联，实现全栈分布式追踪
  - [x] 支持集成 Pyroscope 的持续性能剖析数据
  - [x] 支持 SQL/PromQL API，支持作为 Grafana 的 DataSource
  - [x] 支持将分布式追踪数据展示在 Grafana Tempo 中
  - [x] 支持将追踪数据输出至 OpenTelemetry Collector
  - [x] 支持将追踪数据输出至 SkyWalking

作为规划，DeepFlow 未来还有很多激动人心的特性：
- Universal Map (AutoMetrics)
  - [ ] 基于 TCP 流重组的增强协议解析能力
  - [ ] 内置更多应用协议的解析能力，例如 Elasticsearch 等
  - [ ] 支持更多类型的协议解析插件，例如 Lua 等
  - [ ] 支持 eBPF 采集调用生命周期内的更多网络、系统性能指标
- Distributed Tracing (AutoTracing)
  - [ ] 基于 eBPF 的零侵扰分布式追踪能力支持更多跨线程、Golang Channel 等复杂场景
  - [ ] 根据 Span 实时聚合计算 Trace 拓扑图（同时保留调用链关系），以降低追踪数据的存储开销
- Continuous Profiling (AutoProfiling)
  - [ ] 支持 eBPF 零侵扰采集更多类型的 Profile 数据，例如 OffCPU、Memory 等
  - [ ] 取消 Profile 数据对应用进程符号表的依赖
  - [ ] 支持零侵扰采集 Node.js/Python/PHP/Ruby 应用的 Profile 数据
- AutoTagging & SmartEncoding
  - [ ] 自动注入租户在云平台中录入的业务标签
- Integration
  - [ ] 支持集成 Sentry RUM 数据源
  - [ ] 支持集成 Promtail/Loki 日志数据源
  - [ ] 支持将日志数据展示在 Grafana Loki GUI 中
  - [ ] 支持作为 Prometheus Exporter 输出 eBPF 指标数据
  - [ ] 支持将追踪数据输出至 Kafka
