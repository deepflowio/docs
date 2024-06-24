---
title: DeepFlow Roadmap
permalink: /about/milestone
---

> This document was translated by ChatGPT

As of September 2023, DeepFlow has iterated to version v6.3.9, and the main supported features include:

- Universal Map (AutoMetrics)
  - [x] TCP network performance metrics based on cBPF
  - [x] Various application protocol parsing and performance analysis capabilities based on cBPF
  - [x] Various application protocol parsing and performance analysis capabilities based on eBPF tracepoint/kprobe
  - [x] File read/write performance metrics based on eBPF
  - [x] Golang application HTTP2 and gRPC protocol parsing and performance analysis capabilities based on eBPF uprobe
  - [x] Golang/openssl application HTTPS protocol parsing and performance analysis capabilities based on eBPF uprobe
  - [x] Enhanced standard protocol parsing capabilities using Wasm and so plugins, and the ability to parse private protocols
- Distributed Tracing (AutoTracing)
  - [x] Zero-intrusion distributed tracing capabilities based on eBPF, supporting same-thread for any application and cross-coroutine for Golang applications
  - [x] Extract business serial numbers using Wasm/so plugins to achieve zero-intrusion distributed tracing capabilities relying only on cBPF
  - [x] Parse fields such as X-Request-ID in requests to trace the call chain before and after ALB
  - [x] Parse MySQL Comment fields in requests to trace MySQL call chains
  - [x] Parse fields such as TraceID/SpanID in requests to trace cross-thread call chains
  - [x] Automatically trace network forwarding paths and calculate hop-by-hop performance
- Continuous Profiling (AutoProfiling)
  - [x] Zero-intrusion collection of Profile data for C/C++/Golang/Rust/Java applications using eBPF
  - [x] Zero-intrusion collection of On-CPU Profile using eBPF
- AutoTagging & SmartEncoding
  - [x] Automatically inject cloud resource tags and K8s service tags
  - [x] Automatically inject K8s Label/Annotation/Env custom tags
  - [x] Support injecting business tags from CMDB via API
  - [x] Support injecting process business tags exposed by the business release system via Plugin
  - [x] High-performance SmartEncoding tag storage and query capabilities
- Integration
  - [x] Support integration of Prometheus and Telegraf metric data
  - [x] Support integration of OpenTelemetry and SkyWalking tracing data, and associate with eBPF tracing data to achieve full-stack distributed tracing
  - [x] Support integration of Pyroscope continuous profiling data
  - [x] Support SQL/PromQL API, and act as a DataSource for Grafana
  - [x] Support displaying distributed tracing data in Grafana Tempo
  - [x] Support exporting tracing data to OpenTelemetry Collector
  - [x] Support exporting tracing data to SkyWalking

As a plan, DeepFlow has many exciting features in the future:

- Universal Map (AutoMetrics)
  - [ ] Enhanced protocol parsing capabilities based on TCP stream reassembly
  - [ ] Built-in parsing capabilities for more application protocols, such as Elasticsearch
  - [ ] Support for more types of protocol parsing plugins, such as Lua
  - [ ] Support eBPF collection of more network and system performance metrics during the call lifecycle
- Distributed Tracing (AutoTracing)
  - [ ] Zero-intrusion distributed tracing capabilities based on eBPF to support more complex scenarios such as cross-thread and Golang Channel
  - [ ] Real-time aggregation and calculation of Trace topology based on Span (while retaining call chain relationships) to reduce storage overhead of tracing data
- Continuous Profiling (AutoProfiling)
  - [ ] Zero-intrusion collection of more types of Profile data using eBPF, such as Off-CPU, Memory, etc.
  - [ ] Eliminate the dependency of Profile data on application process symbol tables
  - [ ] Support zero-intrusion collection of Profile data for Node.js/Python/PHP/Ruby applications
- AutoTagging & SmartEncoding
  - [ ] Automatically inject business tags recorded by tenants on cloud platforms
- Integration
  - [ ] Support integration of Sentry RUM data source
  - [ ] Support integration of Promtail/Loki log data source
  - [ ] Support displaying log data in Grafana Loki GUI
  - [ ] Support exporting eBPF metric data as a Prometheus Exporter
  - [ ] Support exporting tracing data to Kafka