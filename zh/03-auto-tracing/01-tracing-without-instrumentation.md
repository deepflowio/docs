---
title: 零侵扰的分布式追踪
---

使用 eBPF，MetaFlow 创新的实现了零侵扰的分布式追踪。MetaFlow 将 eBPF Event、BPF Packet、Thread ID、Coroutine ID、Request 到达时序、TCP 发送时序进行关联，实现了高度自动化的分布式追踪（**AutoTracing**）。目前 AutoTracing 支持所有同步阻塞调用（BIO，Blocking IO）场景、部分同步非阻塞调用（NIO，Non-blocking IO）场景，支持内核线程调度（[kernel-level threading](https://en.wikipedia.org/wiki/Thread_(computing))）场景，在这些场景下支持对任意服务组成的分布式调用链进行追踪。除此之外，通过解析请求中的 X-Request-ID 等字段，也支持对采用 NIO 模式的网关（如 Envoy）前后的调用链进行追踪。

本章将会以两个 Demo 应用为例，展示 MetaFlow 的 AutoTracing 能力。基于 eBPF 的 AutoTracing 是一项探索中的创新工作，还有大量的问题等待我们去解答，例如异步调用（AIO，Asynchronous IO）、协程调度（hybrid threading）等场景下的自动追踪能力。欢迎你一起加入这项激动人心的探索！
