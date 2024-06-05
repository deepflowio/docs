---
title: AutoMetrics
permalink: /features/universal-map/auto-metrics
---

> This document was translated by ChatGPT

# Introduction

In the past, we generally inserted statistical code actively through SDKs, bytecode enhancement, or manual instrumentation. This imposed a heavy burden on application developers who had to adapt to various development languages and different RPC frameworks. Rapid business iterations often led to developers discovering the lack of necessary performance metrics only when dealing with faults. Additionally, operations personnel for foundational services like Nginx and MySQL were more passive, relying on the hope that the foundational service software had already exposed key performance metrics. However, built-in metrics often only provided instance-level granularity and could not distinguish user calls.

DeepFlow’s **AutoMetrics** capability can automatically capture golden performance metrics of API calls for each microservice across the full stack, including application functions, system functions, and network communications. These capabilities are extended to a broader range of Linux kernel versions and Windows operating systems using BPF and AF_PACKET/winpcap.

Currently, DeepFlow supports parsing of mainstream application protocols through eBPF, including HTTP 1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, and DNS. More application protocols will be supported in the future. Based on DeepFlow's AutoMetrics capability, we can non-intrusively obtain RED (Request, Error, Delay) metrics of applications, throughput of the network protocol stack, latency, connection anomalies, retransmissions, zero window, and other metrics. The DeepFlow Agent maintains the session state of each TCP connection and each application protocol request, referred to as `Flow`. All raw performance metric data is detailed down to the Flow level and automatically aggregated into 1-second and 1-minute metric data. Based on these metric data, we can present full-stack performance data of any service, workload, or API, and draw a universal service map.

# Types of Metrics

- [Application Performance Metrics](./application-metrics/)
- [Application Call Logs](./request-log/)
- [Network Performance Metrics](./network-metrics/)
- [Network Flow Logs](./flow-log/)

To more intuitively experience the capabilities of AutoMetrics,
if there is no business traffic in the environment where you run DeepFlow, it is recommended to first refer to the [OpenTelemetry WebStore Demo Experience - Deploy Demo](../../integration/input/tracing/opentelemetry/#部署-demo-2) section to deploy an official OpenTelemetry microservice demo application.
This demo consists of more than ten microservices implemented in languages such as Go, C#, Node.js, Python, and Java. It is specifically noted that all the metric data showcased in this section `does not depend on OpenTelemetry`.

# Observation Point Explanation

DeepFlow automatically collects metric data from various locations through cBPF/eBPF. To differentiate these data observation points, we label the data with the `observation_point` tag.

The meaning of `observation_point` values for data collected by cBPF is as follows:
| Data Source Type | `observation_point` Value | Meaning of Observation Point |
| ---------------- | ------------------------- | --------------------------- |
| cBPF | c | Client NIC |
| cBPF | c-nd | Client Container Node |
| cBPF | c-hv | Client Host |
| cBPF | c-gw-hv | Client to Gateway Host |
| cBPF | c-gw | Client to Gateway |
| cBPF | local | Local NIC |
| cBPF | rest | Other NICs |
| cBPF | s-gw | Gateway to Server |
| cBPF | s-gw-hv | Gateway Host to Server |
| cBPF | s-hv | Server Host |
| cBPF | s-nd | Server Container Node |
| cBPF | s | Server NIC |

The meaning of `observation_point` values for data collected by eBPF is as follows:
| Data Source Type | `observation_point` Value | Meaning of Observation Point |
| ---------------- | ------------------------- | --------------------------- |
| eBPF | c-p | Client Process |
| eBPF | s-p | Server Process |

In addition, after [integrating OpenTelemetry data](../../integration/input/tracing/opentelemetry/), we will also inject the `observation_point` tag, with the following meanings:
| Data Source Type | `observation_point` Value | Meaning of Observation Point |
| ---------------- | ------------------------- | --------------------------- |
| OTel | c-app | Client Application, corresponding to `span.spankind = SPAN_KIND_CLIENT, SPAN_KIND_PRODUCER` |
| OTel | s-app | Server Application, corresponding to `span.spankind = SPAN_KIND_SERVER, SPAN_KIND_CONSUMER` |
| OTel | app | Application, corresponding to other spankind values |
