---
title: 简介
permalink: /install/overview
---

本章介绍 DeepFlow 的部署方法。DeepFlow 可用于监控多个 K8s 上的容器应用、多个 VPC 中的云主机应用。本章的内容安排如下：
- [all-in-one](./all-in-one/)：使用一台虚拟机快速体验 DeepFlow
- [single-k8s](./single-k8s/)：部署 DeepFlow 监控一个 K8s 集群上的所有应用，所有观测数据将会自动注入`K8s 资源`和`K8s 自定义 Label`标签
- [multi-k8s](./multi-k8s/)：部署 DeepFlow 监控多个 K8s 集群上的所有应用
- [legacy-host](./legacy-host/)：部署 DeepFlow 监控传统服务器上的所有应用
- [cloud-host](./cloud-host/)：部署 DeepFlow 监控云服务器上的所有应用，所有观测数据将会自动注入`云资源`标签
- [managed-k8s](./managed-k8s/)：部署 DeepFlow 监控云服务商托管 K8s 集群上的所有应用，所有观测数据将会自动注入`云资源`、`K8s 资源`、`K8s 自定义 Label`标签
- [advanced-config](./install/advanced-config/)：DeepFlow 高级配置

如果你现在没有合适的资源部署 DeepFlow，也可登录我们的[在线 Demo](https://ce-demo.deepflow.yunshan.net)（用户名/密码均为 `deepflow`），
借助如下文档章节抢先体验 DeepFlow 的强大能力：
- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无盲点分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)
