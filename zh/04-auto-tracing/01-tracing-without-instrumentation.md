---
title: 零侵扰的分布式追踪
---

以往我们一般通过 SDK、字节码增强或手动埋点方式主动插入追踪代码，这给应用开发者带来了沉重的负担，他们需要适配各种开发语言和 RPC 框架。当业务使用非 Java 语言实现时，即使 Tracer 可以通过 SDK 进行封装以降低侵入性，也还会存在 SDK 更新导致应用需要重新发布的问题。另一方面，在云原生环境下手动插码的方式迎来了更多的挑战，任何一个应用调用需要穿越从微服务、Sidecar、iptables/ipvs 容器网络、虚拟机 vsiwtch、云网络、NFV网关等复杂的路径，可观测性建设应该能覆盖云原生环境下从应用到基础设施的全栈，但这并不能通过向业务代码中插入追踪代码来实现。

基于 eBPF，MetaFlow 创新的实现了零侵扰的分布式追踪。MetaFlow 将 eBPF Event、BPF Packet、Thread ID、Coroutine ID、Request 到达时序、TCP 发送时序进行关联，实现了高度自动化的分布式追踪（**AutoTracing**）。目前 AutoTracing 支持所有同步阻塞调用（BIO，Blocking IO）场景、部分同步非阻塞调用（NIO，Non-blocking IO）场景，支持内核线程调度（[kernel-level threading](https://en.wikipedia.org/wiki/Thread_(computing))）场景，在这些场景下支持对任意服务组成的分布式调用链进行追踪。除此之外，通过解析请求中的 X-Request-ID 等字段，也支持对采用 NIO 模式的网关（如 Envoy）前后的调用链进行追踪。

本章将会以两个 Demo 应用为例，展示 MetaFlow 的 AutoTracing 能力。这两个 Demo 不依赖插入任何 Jaeger、OpenTelemetry、SkyWalking 代码，完全基于 eBPF 采集的数据即可完成分布式追踪。基于 eBPF 的 AutoTracing 是一项探索中的创新工作，还有大量的问题等待我们去解答，例如异步调用（AIO，Asynchronous IO）、协程调度（hybrid threading）等场景下的自动追踪能力。欢迎你一起加入这项激动人心的探索！

::: tip 说明
目前我们以 Grafana Panel 展示 Trace 数据，发现非常受局限，下个版本将修改为通过 Grafana Tempo 展示。
:::
