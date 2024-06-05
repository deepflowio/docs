---
title: DeepFlow Milestones
permalink: /about/milestone
---

> This document was translated by ChatGPT

As of now (September 2023), DeepFlow has iterated to v6.3.9. The main supported features are:

- Universal Map (AutoMetrics)
  - [x] TCP network performance metrics based on cBPF
  - [x] Application protocol parsing and performance analysis based on cBPF
  - [x] Application protocol parsing and performance analysis based on eBPF tracepoint/kprobe
  - [x] File read and write performance indicators based on eBPF
  - [x] Golang application HTTP2, gRPC protocol parsing, and performance analysis based on eBPF uprobe
  - [x] Golang/openssl HTTPS protocol parsing and performance analysis based on eBPF uprobe
  - [x] Use Wasm, so plugins to enhance the parsing of standard protocols, and to achieve private protocol parsing
- Distributed Tracing (AutoTracing)
  - [x] Support for eBPF-based non-intrusive distributed tracing, supporting any application with same-thread, Golang applications with cross-coroutine call chains
  - [x] Use of Wasm/so plugins to extract business serial numbers, implementing non-intrusive distributed tracing only dependent on cBPF
  - [x] Support for tracing call chains before and after ALB by parsing X-Request-ID fields in requests
  - [x] Support for tracking MySQL call chains by parsing MySQL Comment fields in requests
  - [x] Support for tracking cross-thread call chains by parsing TraceID/SpanID fields in requests
  - [x] Support for automatically tracing the network forwarding path, calculating the performance per hop
- Continuous Profiling (AutoProfiling)
  - [x] Support for eBPF non-intrusive collection of Profile data for C/C++/Golang/Rust/Java applications
  - [x] Support for eBPF non-intrusive collection of OnCPU Profile
- AutoTagging & SmartEncoding
  - [x] Automatic injection of cloud resource tags, K8s service tags
  - [x] Automatic injection of K8s Label/Annotation/Env custom labels
  - [x] Support for injecting business tags in CMDB via API
  - [x] Support for injecting process business labels exposed by the business release system via Plugin
  - [x] High-performance SmartEncoding label storage query capabilities
- Integration
  - [x] Support for integrating metrics data from Prometheus and Telegraf
  - [x] Support for integrating tracing data from OpenTelemetry and SkyWalking and associating it with eBPF tracing data to achieve full-stack distributed tracing
  - [x] Support for integrating continuous performance profiling data from Pyroscope
  - [x] Support for SQL/PromQL API, support for being a Grafana DataSource
  - [x] Support for displaying distributed tracing data in Grafana Tempo
  - [x] Support for exporting tracing data to OpenTelemetry Collector
  - [x] Support for exporting tracing data to SkyWalking

There are many exciting future plans for DeepFlow：

- Universal Map (AutoMetrics)
  - [ ] Enhanced protocol parsing ability based on TCP stream reassembly
  - [ ] Built-in parsing capability for more application protocols, such as Elasticsearch
  - [ ] Support for more types of protocol parsing plugins, such as Lua
  - [ ] Support for eBPF collection of more network and system performance indicators within the call lifecycle
- Distributed Tracing (AutoTracing)
  - [ ] eBPF-based non-intrusive distributed tracing capability supports more complex scenarios such as cross-thread, Golang Channel
  - [ ] Real-time aggregation and calculation of Trace topology based on Span (while preserving the call chain relationship), to reduce the storage overhead of tracing data
- Continuous Profiling (AutoProfiling)
  - [ ] Support for eBPF non-intrusive collection of more types of Profile data, such as OffCPU, Memory
  - [ ] Elimination of Profile data's dependency on application process symbol tables
  - [ ] Support for non-intrusive collection of Profile data for Node.js/Python/PHP/Ruby applications
- AutoTagging & SmartEncoding
  - [ ] Automatic injection of business labels entered by the tenant on the cloud platform
- Integration
  - [ ] Support for integration with Sentry RUM data source
  - [ ] Support for integration with Promtail/Loki log data source
  - [ ] Support for displaying log data in Grafana Loki GUI
  - [ ] Support for outputting eBPF metrics data as a Prometheus Exporter
  - [ ] Support for exporting tracing data to Kafka
