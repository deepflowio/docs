---
title: 全栈分布式追踪
permalink: /integration/input/tracing/full-stack-distributed-tracing
---

DeepFlow 利用 eBPF 创新的实现了 AutoTracing，对分布式调用的追踪覆盖了 API 调用和网络传输两个层面，这与 OpenTelemetry 对应用代码内函数粒度的覆盖正好形成互补。

通过集成 OpenTelemetry、SkyWalking 等 APM 数据源，AutoTracing 能力更加完善，能够实现打通应用、系统、网络的全栈分布式追踪能力。在下图中的火焰图中我们可以看到：
- 复杂冗长的网关路径都能追踪，包括 API 网关、微服务网关、负载均衡器、Ingress 等
- 任意微服务的上下游调用都能追踪，包括开发者容易忽略的 DNS 等调用，包括 MySQL、Redis 等无法插码的服务
- 任意两个微服务之间的全栈网络路径都能追踪，覆盖从应用代码到系统调用、Sidecar/iptables/ipvs 等容器网络组件、OvS/LinuxBridge 等虚拟机网络组件、NFV 网关等云网络组件

![DeepFlow 与 APM 集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

DeepFlow 与 APM 的集成方法很多，分为如下四种：
- 由 DeepFlow 展示全栈分布式追踪结果
  - 1. **调用 API**：DeepFlow 调用 APM 的 `Trace API`，获取 APM 中的 APP Span，配置方法参考[调用 APM Trace API](./apm-trace-api/)
  - 2. **导入数据**：DeepFlow 以 OTLP 协议接收 APM 导出的 APP Span，配置方法参考[导入 OpenTelemetry 数据](./opentelemetry/)和[导入 SkyWalking 数据](./skywalking/)
- 由 APM 展示全栈分布式追踪结果
  - 3. **提供 API**：APM 调用 DeepFlow 提供的 `Trace Completion API`，获取 DepeFlow 中的 SYS Span 和 NET Span，配置方法参考 [Trace Completion API](../../output/query/trace-completion/) 文档
  - 4. **导出数据**：APM 以 OTLP 协议接收 DeepFlow 导出的 SYS Span 和 NET Span，配置方法参考 [OTLP Exporter](../../output/export/opentelemetry-exporter/) 文档

上述四种方法中，方案 1 和 2 的工作量最低，只需配置即可；方案 3 的开发工作量也非常小，非常适合前期使用；方案 4 需要理解 SYS Span、NET Span 与 APP Span 的关联逻辑，开发工作量较大，适合对 DeepFlow 深入理解后使用。
