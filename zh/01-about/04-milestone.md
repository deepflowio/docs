---
title: MetaFlow 路标
---

MetaFlow诞生于云杉网络的商业产品DeepFlow，后者目前已经发展到了v6.1.0。目前还有一些代码整理的工作需要进行，我们计划在2022年6月发布首个可下载使用的版本，具备如下特性：
- 基于eBPF、BPF+AF\_PACKET的AutoMetrics能力
- 基于eBPF的HTTP 1/2/S、Dubbo、MySQL、Redis、Kafka、DNS应用协议解析能力
- 基于eBPF的AutoTracing分布式链路追踪能力，支持同步并发模型、kernel-level threading调度模型
- 自动同步K8s apiserver并注入资源和服务标签的AutoTagging能力
- 高性能的SmartEncoding标签注入能力
- Prometheus和OpenTelemetry数据的集成能力
- 使用ClickHouse作为默认分析数据库
- 使用Grafana作为默认可视化组件

MetaFlow未来还有很多激动人心的特性等待我们和社区一起开发，包括：
- AutoMetrics & AutoTracing
  - 支持解析更多的应用协议
  - 增强和OpenTelemetry的集成能力，通过eBPF插入OTel Tracer API
  - 支持更加自动化的AutoTracing能力，探索对异步并发模型、hybrid threading调度模型的支持
  - 基于BPF+Winpcap的AutoMetrics能力
  - 支持Agent主动拨测获取Metrics
  - 支持使用eBPF采集On/Off CPU火焰图，提供零侵扰的Continue Profile能力
- AutoTagging & SmartEncoding
  - 非容器环境下自动同步并注入进程标签信息
  - 同步服务注册中心，自动注入服务和API属性信息
- Agent
  - 支持WASM的可编程应用协议解析能力
  - 集成SkyWalking、Sentry、Telegraf、Loki等更多数据源
  - 支持运行于Andriod操作系统中（智能汽车场景）
  - 支持Agent以Sidecar形式运行于Serverless Pod中
- Server
  - 支持更多的分析数据库
  - 支持更多的QL方言
