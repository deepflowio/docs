---
title: 监控多个K8s集群
---

# 部署拓扑

```mermaid
flowchart LR

subgraph K8s-Cluster-1
  MetaFlowServer["metaflow-server (statefulset)"]
  MetaFlowAgent1["metaflow-agent (daemonset)"]
  MetaFlowAgent1 -->|load balancing| MetaFlowServer
end

subgraph K8s-Cluster-2
  MetaFlowAgent2["metaflow-agent (daemonset)"]
  MetaFlowAgent2 -->|load balancing| MetaFlowServer
end
```

# 部署 MetaFlow Agent

TODO

# 下一步

- [自动分布式追踪 - 体验 MetaFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/overview.html)
- [微服务全景图 - 体验 MetaFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/overview.html)
- [消除数据孤岛 - 了解 MetaFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos.html)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/tracing/overview.html)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/metrics/overview.html)