---
title: 监控单个K8s集群
---

# 简介

假设您在一个 K8s 集群中部署了应用，本章介绍如何使用 MetaFlow 进行监控。

# 部署拓扑

```mermaid
flowchart TD

subgraph K8s-Cluster
  APIServer["k8s apiserver"]

  subgraph MetaFlow Backend
    MetaFlowServer["metaflow-server (statefulset)"]
    ClickHouse["clickhouse (statefulset)"]
    MySQL["mysql (statefulset)"]
    MetaFlowApp["metaflow-app (deployment)"]
    Grafana["grafana (deployment)"]
  end

  subgraph MetaFlow Frontend
    MetaFlowAgent["metaflow-agent (daemonset)"]
  end

  MetaFlowAgent -->|"control & data"| MetaFlowServer
  MetaFlowAgent -->|"get resource & label"| APIServer

  MetaFlowServer --> ClickHouse
  MetaFlowServer --> MySQL
  MetaFlowApp -->|sql| MetaFlowServer
  Grafana -->|"metrics/logging (sql)"| MetaFlowServer
  Grafana -->|"tracing (api)"| MetaFlowApp
end
```

# 运行 PVC 控制器

可选择 [OpenEBS](https://openebs.io/) 用于创建 PVC：
```console
kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
```

# 部署 MetaFlow

使用Helm安装一个 All-in-One MetaFlow：
```console
NAMESPACE=metaflow
HELM_RELEASE=metaflow

helm repo add metaflow https://metaflowys.github.io/metaflow
helm repo udpate metaflow
helm install $HELM_RELEASE -n $NAMESPACE metaflow/metaflow --create-namespace
```

# 下一步

- [自动分布式追踪 - 体验 MetaFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/overview.html)
- [微服务全景图 - 体验 MetaFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/overview.html)
- [消除数据孤岛 - 了解 MetaFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos.html)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/tracing/overview.html)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/metrics/overview.html)
