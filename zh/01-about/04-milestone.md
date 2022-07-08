---
title: MetaFlow 路标
---

MetaFlow 诞生于云杉网络的商业产品 DeepFlow，后者目前已经发展到了 v6.1.0。目前还有一些代码整理的工作需要进行，我们计划在 2022 年 7 月发布首个可下载使用的版本 v6.1.1，具备如下特性：
- 基于 eBPF、BPF+AF\_PACKET 的 AutoMetrics 能力
- 基于 eBPF 的 HTTP 1/2/S、Dubbo、MySQL、Redis、Kafka、MQTT、DNS 应用协议解析能力
- 基于 eBPF 的 AutoTracing 分布式链路追踪能力，支持同步并发模型、kernel-level threading 调度模型
- 自动同步 K8s apiserver 并注入资源和服务标签的 AutoTagging 能力
- 高性能的 SmartEncoding 标签注入能力
- Prometheus 和 OpenTelemetry 数据的集成能力
- 使用 ClickHouse 作为默认分析数据库
- 使用 Grafana 作为默认可视化组件

MetaFlow未来还有很多激动人心的特性等待我们和社区一起开发，包括：
- AutoMetrics & AutoTracing
  - 支持解析更多的应用协议
  - 增强和 OpenTelemetry 的集成能力，通过 eBPF 插入OTel Tracer API
  - 支持更加自动化的 AutoTracing 能力，探索对异步并发模型、hybrid threading 调度模型的支持
  - 基于 BPF+Winpcap 的 AutoMetrics 能力
  - 支持 Agent 主动拨测获取 Metrics
  - 支持使用 eBPF 采集 On/Off CPU 火焰图，提供零侵扰的 Continue Profile 能力
- AutoTagging & SmartEncoding
  - 非容器环境下自动同步并注入进程标签信息
  - 同步服务注册中心，自动注入服务和 API 属性信息
- Agent
  - 支持 WASM 的可编程应用协议解析能力
  - 集成 SkyWalking、Sentry、Telegraf、Loki 等更多数据源
  - 支持运行于 Andriod 操作系统中（智能汽车场景）
  - 支持 Agent 以 Sidecar 形式运行于 Serverless Pod 中
- Server
  - 支持更多的分析数据库
  - 支持更多的 QL 方言
