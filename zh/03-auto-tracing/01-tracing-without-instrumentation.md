---
title: 零侵扰的分布式追踪
---

使用 eBPF，MetaFlow 创新的实现了零侵扰的分布式追踪。MetaFlow 将 eBPF Event、BPF Packet、Thread ID、Coroutine ID、Request 到达时序、TCP 发送时序进行关联，实现了高度自动化的分布式追踪（**AutoTracing**）。目前 AutoTracing 支持同步并发模型、[kernel-level threading](https://en.wikipedia.org/wiki/Thread_(computing)) 模型场景下任意微服务的上下游调用追踪。

本章将会以两个 Demo 应用为例，展示 MetaFlow 的 AutoTracing 能力。基于 eBPF 的 AutoTracing 是一项探索中的创新工作，还有大量的问题等待我们去解答，例如异步调用、协程调度、hybrid threading 等场景下的自动追踪能力。欢迎你一起加入这项激动人心的探索！
