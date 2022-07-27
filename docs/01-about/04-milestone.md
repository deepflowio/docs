---
title: DeepFlow Milestone
permalink: /about/milestone
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

DeepFlow has been iterated to v6.1.0 before open source, and v6.1.1 planned to be released in July 2022 will be the first downloadable community version, which will have the following features:
- AutoMetrics
  - [x] TCP network performance indicators based on BPF+AF\_PACKET
  - [x] HTTP1/2, Dubbo, MySQL, Redis, Kafka, MQTT, DNS application protocol resolution capabilities based on BPF+AF\_PACKET
  - [x] HTTP1/2, Dubbo, MySQL, Redis, Kafka, MQTT, DNS application protocol resolution capabilities based on eBPF tracepoint/kprobe
  - [x] Golang application HTTPS protocol parsing capability based on eBPF USDT/uprobe
- AutoTracing
  - [x] AutoTracing distributed link tracing capability based on eBPF
  - [x] Support to trace the distributed call chain composed of any service in all synchronous blocking call (BIO, Blocking IO) scenarios
  - [x] Support for tracing distributed call chains composed of arbitrary services in partially synchronous non-blocking call (NIO, Non-blocking IO) scenarios
  - [x] Support kernel thread scheduling ([kernel-level threading](https://en.wikipedia.org/wiki/Thread_(computing))) scenarios
  - [x] Support parsing fields such as X-Request-ID in the request to track the call chain before and after gateways in NIO mode (such as Envoy)
  - [x] Integrate seamless tracing capabilities of eBPF and OpenTelemetry distributed tracing data
- AutoTagging & SmartEncoding
  - [x] Automatically inject K8s resource tags, custom Label tags
  - [x] Automatically inject public cloud resource tags
  - [x] High-performance SmartEncoding tag storage query capability
- Agent Integration
  - [x] Integrate metrics data from Prometheus and Telegraf
  - [x] Integrate tracking data from OpenTelemetry and SkyWalking
- Server Integration
  - [x] Provide SQL API as DataSource for Grafana
  - [x] Use ClickHouse as storage engine

There are many more exciting features of DeepFlow waiting for us to develop together with the community in the future, including:
- AutoMetrics
  - [ ] AutoMetrics capability based on BPF+Winpcap
  - [ ] C/C++/Java/Golang and other applications based on eBPF USDT/uprobe HTTP2/HTTPS protocol parsing capability
- AutoTracing
  - [ ] Support more synchronous non-blocking call (NIO, Non-blocking IO) scenarios
  - [ ] Support asynchronous call (AIO, Asynchronous IO) scenarios
  - [ ] Support for hybrid threading scenarios
  - [ ] Enhanced integration with OpenTelemetry, plugged into OTel Tracer API via eBPF
- AutoTagging & SmartEncoding
  - [ ] Synchronize service registry, automatically inject service and API property information
  - [ ] Automatically synchronize and inject process label information in non-container environments
- Active Probe
  - [ ] Support Agent to initiate active dial test to obtain Metrics
- Continuous Profiler
  - [ ] Support to use eBPF to collect On/Off CPU flame graph, providing zero-intrusive Continue Profile capability
- Agent Programmability
  - [ ] Supports WASM's programmable application protocol parsing capabilities
- Agent Adaptability
  - [ ] Support Agent to run in Serverless Pod as Sidecar
  - [ ] Support running on Android operating system (smart car scenario)
- Agent Integration
  - [ ] Integrate Sentry RUM data source
  - [ ] Integrate Promtail/Loki log data source
  - [ ] Supports outputting data to log files and collecting through the log collection service iLogTail
- Server Integration
  - [ ] Support for displaying distributed tracing data in Grafana Tempo
  - [ ] Support displaying log data in Grafana Loki GUI
  - [ ] Support PromQL as query API
  - [ ] Support exporting BPF/eBPF indicator data as Prometheus Exporter
  - [ ] Support exporting data to OpenTelemetry Collector
  - [ ] Support output data to Kafka
  - [ ] Supports writing data to public cloud log storage services
