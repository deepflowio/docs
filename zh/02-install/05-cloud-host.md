---
title: 监控云服务器
---

# 部署拓扑

```mermaid
flowchart TD

subgraph VPC-1
  subgraph K8s-Cluster
    MetaFlowServer["metaflow-server (statefulset)"]
  end
  
  subgraph Cloud-Host-1
    MetaFlowAgent1[metaflow-agent]
    MetaFlowAgent1 --> MetaFlowServer
  end
end

subgraph VPC-2
  subgraph Cloud-Host-2
    MetaFlowAgent2[metaflow-agent]
    MetaFlowAgent2 -->|"tcp/udp 30033+30035"| MetaFlowServer
  end
end

MetaFlowServer -->|"get resource & label"| CloudAPI[cloud api service]
```

# 部署 MetaFlow Agent

TODO

# 下一步

- [自动分布式追踪 - 体验 MetaFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/overview.html)
- [微服务全景图 - 体验 MetaFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/overview.html)
- [消除数据孤岛 - 了解 MetaFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos.html)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/tracing/overview.html)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/metrics/overview.html)
