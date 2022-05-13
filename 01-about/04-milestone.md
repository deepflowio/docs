---
title: MetaFlow Milestone
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

MetaFlow was born from DeepFlow, a commercial product of Yunshan Networks, which has now developed to v6.1.0. There is still some code refactor work to be done. We plan to release the first downloadable version in June 2022, with the following features:
- AutoMetrics capability based on eBPF, BPF+AF\_PACKET
- HTTP 1/2/S, Dubbo, MySQL, Redis, Kafka, DNS application protocol parsing capabilities based on eBPF
- AutoTracing distributed span tracing capability based on eBPF, supports synchronous concurrency model and kernel-level thread scheduling model
- AutoTagging capability to automatically synchronize K8s apiserver and inject resource and service tags
- High-performance SmartEncoding tag injection capability
- Integration capabilities for Prometheus and OpenTelemetry
- Use ClickHouse as default database
- Use Grafana as default visualization component

There are many exciting features waiting for us to develop together with the community, including:
- AutoMetrics & AutoTracing
  - Support more application protocols
  - Enhanced integration with OpenTelemetry, plugged into OTel Tracer API via eBPF
  - Support more automated AutoTracing capabilities, explore support for asynchronous concurrency models and hybrid threading scheduling models
  - AutoMetrics capability based on BPF+Winpcap
  - Support Agent to actively dial test to obtain metrics
  - Supports collecting On/Off CPU flame graphs with eBPF, providing zero-intrusion Continue Profile capability
- AutoTagging & SmartEncoding
  - Automatically synchronize and inject process label information in a non-container environment
  - Synchronize service registry, automatically inject service and API property information
- Agent
  - Support WASM programmable application protocol parsing capability
  - Integrate SkyWalking, Sentry, Telegraf, Loki and more data sources
  - Support Android operating system (smart car scene)
  - Support Agent running in Serverless Pod as Sidecar
- Server
  - Support for more analytical databases
  - Support for more QL dialects
