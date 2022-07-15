---
title: 无缝链路追踪
---

MetaFlow 利用 eBPF 创新的实现了 AutoTracing，对分布式调用的追踪覆盖了操作系统和网络两个层面，这与 OpenTelemetry 对应用代码内函数粒度的覆盖正好形成互补。

通过集成 OpenTelemetry 等应用 Span 数据源，AutoTracing 能力更加完善，能够消除分布式调用链中的任何盲点。在下图中的火焰图中我们可以看到：
- 任意微服务的上下游调用都能追踪，包括开发者容易忽略的 DNS 等调用，包括 MySQL 等无法插码的服务
- 任意两个微服务之间的网络路径都能追踪，从应用代码到系统调用、Sidecar、容器网络、虚拟机网络、云网络

![Tracing without blind spots](../../about/imgs/tracing-without-blind-spots.png)

::: tip 说明
目前我们以 Grafana Panel 展示 Trace 数据，发现非常受局限，下个版本将修改为通过 Grafana Tempo 展示。
:::
