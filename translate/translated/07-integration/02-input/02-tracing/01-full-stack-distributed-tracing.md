---
title: Full Stack Distributed Tracing
permalink: /integration/input/tracing/full-stack-distributed-tracing
---

> This document was translated by GPT-4

DeepFlow has innovatively implemented AutoTracing using eBPF, which provides distributed tracing covering both API calls and network transfers. This complements the coverage of function granularity inside application code by OpenTelemetry.

By integrating APM data sources such as OpenTelemetry and SkyWalking, the capabilities of AutoTracing have been enhanced, realizing a full stack distributed tracing capability that penetrates applications, systems, and networks. In the following flame graph, we can see:

- Complex and lengthy gateway paths can be traced, including API gateways, microservice gateways, load balancers, Ingress, etc.
- The upstream and downstream calls of any microservice can be traced, including those easily overlooked by developers, such as DNS calls, services like MySQL, Redis, etc., which cannot be instrumented.
- The full stack network path between any two microservices can be traced, covering application code to system calls, container network components such as Sidecar/iptables/ipvs, virtual machine network components like OvS/LinuxBridge, and cloud network components like NFV gateways.

![DeepFlow and APM integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

There are many methods of integrating DeepFlow with APM, divided into the following four types:

- The results of full stack distributed tracing are displayed by DeepFlow
  - 1. **Call API**: DeepFlow calls the APM `Trace API` to get the APP Span in APM, for configuration method, please refer to [Call APM Trace API](./apm-trace-api/)
  - 2. **Import data**: DeepFlow receives the APP Span exported by APM via the OTLP protocol, for the configuration method, please refer to [Import OpenTelemetry Data](./opentelemetry/) and [Import SkyWalking Data](./skywalking/)
- The results of full stack distributed tracing are displayed by APM
  - 3. **Provide API**: APM calls DeepFlow’s `Trace Completion API` to get SYS Span and NET Span in DepeFlow, for the configuration method, please refer to [Trace Completion API](../../output/query/trace-completion/) document
  - 4. **Export data**: APM receives SYS Span and NET Span exported by DeepFlow via OTLP protocol, for the configuration method, please refer to [OTLP Exporter](../../output/export/opentelemetry-exporter/) document.

Among these four methods, schemes 1 and 2 require the least work, requiring only configuration; scheme 3 also requires very little development work and is ideal for early use; scheme 4 requires understanding the logic of the relationship between SYS Span, NET Span, and APP Span. The development work is relatively large, and it is suitable for use after gaining an in-depth understanding of DeepFlow.
