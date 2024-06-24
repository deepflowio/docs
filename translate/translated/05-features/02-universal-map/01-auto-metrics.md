---
title: AutoMetrics
permalink: /features/universal-map/auto-metrics
---

> This document was translated by ChatGPT

# Introduction

In the past, we typically inserted statistical code actively through SDKs, bytecode enhancement, or manual instrumentation. This imposed a heavy burden on application developers, who needed to adapt to various programming languages and RPC frameworks. Rapid business iterations often led developers to discover the lack of necessary performance metrics only when dealing with failures. Additionally, operations personnel for foundational services like Nginx and MySQL were more passive, relying on the hope that these services had already exposed key performance metrics. However, built-in metrics often only provided instance-level granularity, unable to distinguish user calls.

DeepFlow's **AutoMetrics** capability can automatically obtain golden performance metrics for each microservice's API calls across the full-stack path, including application functions, system functions, and network communications. These capabilities are extended to a broader range of Linux kernel versions and Windows operating systems through BPF and AF_PACKET/winpcap.

Currently, DeepFlow supports the parsing of mainstream application protocols via eBPF, including HTTP 1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, and DNS, with plans to support more application protocols in the future. Based on DeepFlow's AutoMetrics capability, it is possible to non-intrusively obtain RED (Request, Error, Delay) metrics for applications, as well as throughput, latency, connection anomalies, retransmissions, zero windows, and other metrics for the network protocol stack. The DeepFlow Agent maintains the session state for each TCP connection and each application protocol request, referred to as `Flow`. All raw performance metric data is detailed to the Flow level and automatically aggregated to generate 1s and 1min metric data. Based on these metric data, we can present full-stack performance data for any service, workload, or API and draw a universal map of interactions between any services.

# Metric Types

- [Application Performance Metrics](./application-metrics/)
- [Application Request Logs](./request-log/)
- [Network Performance Metrics](./network-metrics/)
- [Network Flow Logs](./flow-log/)

To more intuitively experience the capabilities of AutoMetrics, if there is no business traffic in your DeepFlow environment, it is recommended to first refer to the [OpenTelemetry WebStore Demo Experience - Deploy Demo](../../integration/input/tracing/opentelemetry/#部署-demo-2) section to deploy an official OpenTelemetry microservice demo application. This demo consists of more than ten microservices implemented in languages such as Go, C#, Node.js, Python, and Java. It is particularly noted that all metric data presented in this section `has no dependency on OpenTelemetry`.

# Observation Point Explanation

DeepFlow automatically collects metric data from various locations through cBPF/eBPF. To distinguish these data observation points, we use the `observation_point` label to annotate the data.

For data collected by cBPF, the meanings of `observation_point` values are as follows:
| Data Source Type | `observation_point` Value | Observation Point Meaning |
| ---------------- | ------------------------- | ------------------------- |
| cBPF             | c                         | Client Network Card       |
| cBPF             | c-nd                      | Client Container Node     |
| cBPF             | c-hv                      | Client Host Machine       |
| cBPF             | c-gw-hv                   | Client to Gateway Host    |
| cBPF             | c-gw                      | Client to Gateway         |
| cBPF             | local                     | Local Network Card        |
| cBPF             | rest                      | Other Network Cards       |
| cBPF             | s-gw                      | Gateway to Server         |
| cBPF             | s-gw-hv                   | Gateway Host to Server    |
| cBPF             | s-hv                      | Server Host Machine       |
| cBPF             | s-nd                      | Server Container Node     |
| cBPF             | s                         | Server Network Card       |

For data collected by eBPF, the meanings of `observation_point` values are as follows:
| Data Source Type | `observation_point` Value | Observation Point Meaning |
| ---------------- | ------------------------- | ------------------------- |
| eBPF             | c-p                       | Client Process            |
| eBPF             | s-p                       | Server Process            |

Additionally, after [integrating OpenTelemetry data](../../integration/input/tracing/opentelemetry/), we also inject the `observation_point` label, with the following meanings:
| Data Source Type | `observation_point` Value | Observation Point Meaning |
| ---------------- | ------------------------- | ------------------------- |
| OTel             | c-app                     | Client Application, corresponding to `span.spankind = SPAN_KIND_CLIENT, SPAN_KIND_PRODUCER` |
| OTel             | s-app                     | Server Application, corresponding to `span.spankind = SPAN_KIND_SERVER, SPAN_KIND_CONSUMER` |
| OTel             | app                       | Application, corresponding to other spankind values |
