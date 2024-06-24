---
title: Full-Stack Distributed Tracing
permalink: /integration/input/tracing/full-stack-distributed-tracing
---

> This document was translated by ChatGPT

DeepFlow leverages eBPF to innovatively implement AutoTracing, covering distributed tracing at both the API call and network transmission levels. This complements OpenTelemetry's function-level coverage within application code.

By integrating APM data sources such as OpenTelemetry and SkyWalking, AutoTracing capabilities are further enhanced, enabling full-stack distributed tracing across applications, systems, and networks. In the flame graph below, we can observe:

- Complex and lengthy gateway paths can be traced, including API gateways, microservice gateways, load balancers, Ingress, etc.
- Upstream and downstream calls of any microservice can be traced, including often-overlooked calls like DNS, and services that cannot be instrumented like MySQL and Redis.
- Full-stack network paths between any two microservices can be traced, covering from application code to system calls, container network components like Sidecar/iptables/ipvs, virtual machine network components like OvS/LinuxBridge, and cloud network components like NFV gateways.

![DeepFlow and APM Integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

There are several methods for integrating DeepFlow with APM, categorized into four types:

- Full-stack distributed tracing results displayed by DeepFlow
  - 1. **API Call**: DeepFlow calls the APM's `Trace API` to obtain APP Spans from the APM. Configuration methods can be found in [Calling APM Trace API](./apm-trace-api/)
  - 2. **Data Import**: DeepFlow receives APP Spans exported by APM via the OTLP protocol. Configuration methods can be found in [Importing OpenTelemetry Data](./opentelemetry/) and [Importing SkyWalking Data](./skywalking/)
- Full-stack distributed tracing results displayed by APM
  - 3. **Providing API**: APM calls the `Trace Completion API` provided by DeepFlow to obtain SYS Spans and NET Spans from DeepFlow. Configuration methods can be found in the [Trace Completion API](../../output/query/trace-completion/) documentation
  - 4. **Data Export**: APM receives SYS Spans and NET Spans exported by DeepFlow via the OTLP protocol. Configuration methods can be found in the [OTLP Exporter](../../output/export/opentelemetry-exporter/) documentation

Among the four methods mentioned above, methods 1 and 2 require the least effort, as they only need configuration; method 3 also has a very small development workload, making it very suitable for initial use; method 4 requires understanding the association logic between SYS Span, NET Span, and APP Span, and has a larger development workload, making it suitable for use after gaining a deep understanding of DeepFlow.