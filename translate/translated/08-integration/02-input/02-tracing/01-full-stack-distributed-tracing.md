---
title: Full-Stack Distributed Tracing
permalink: /integration/input/tracing/full-stack-distributed-tracing
---

> This document was translated by ChatGPT

DeepFlow leverages eBPF innovations to implement AutoTracing, covering distributed tracing at both the API call and network transmission layers. This complements OpenTelemetry’s coverage at the function granularity within application code.

By integrating APM data sources such as OpenTelemetry and SkyWalking, the AutoTracing capability becomes more complete, enabling full-stack distributed tracing across applications, systems, and networks. In the flame graph below, we can see:

- The ability to trace complex and lengthy gateway paths, including API gateways, microservice gateways, load balancers, Ingress, and more
- The ability to trace upstream and downstream calls of any microservice, including calls often overlooked by developers such as DNS, as well as services like MySQL and Redis that cannot be instrumented
- The ability to trace the full-stack network path between any two microservices, covering everything from application code to system calls, container network components such as Sidecar/iptables/ipvs, virtual machine network components such as OvS/LinuxBridge, and cloud network components such as NFV gateways

![DeepFlow with APM Integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

There are several ways to integrate DeepFlow with APM, categorized into the following four types:

- Full-stack distributed tracing results displayed by DeepFlow  
  - 1. **Call API**: DeepFlow calls the APM’s `Trace API` to obtain APP Spans from the APM. For configuration, refer to [Calling APM Trace API](./apm-trace-api/)  
  - 2. **Import Data**: DeepFlow receives APP Spans exported by the APM via the OTLP protocol. For configuration, refer to [Importing OpenTelemetry Data](./opentelemetry/) and [Importing SkyWalking Data](./skywalking/)  
- Full-stack distributed tracing results displayed by the APM  
  - 3. **Provide API**: The APM calls the `Trace Completion API` provided by DeepFlow to obtain SYS Spans and NET Spans from DeepFlow. For configuration, refer to the [Trace Completion API](../../output/query/trace-completion/) documentation  
  - 4. **Export Data**: The APM receives SYS Spans and NET Spans exported by DeepFlow via the OTLP protocol. For configuration, refer to the [OTLP Exporter](../../output/export/opentelemetry-exporter/) documentation  

Among these four methods, options 1 and 2 require the least effort and only need configuration; option 3 also requires minimal development work and is well-suited for early-stage use; option 4 requires understanding the correlation logic between SYS Spans, NET Spans, and APP Spans, involves more development work, and is better suited for use after gaining a deeper understanding of DeepFlow.