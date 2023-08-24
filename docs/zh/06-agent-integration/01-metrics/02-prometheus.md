---
title: 集成 Prometheus 数据
permalink: /agent-integration/metrics/prometheus
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  Prometheus["prometheus-server (deployment)"]
  DeepFlowAgent["deepflow-agent (daemonset)"]
  DeepFlowServer["deepflow-server (deployment)"]

  Prometheus -->|metrics| DeepFlowAgent
  DeepFlowAgent -->|metrics| DeepFlowServer
end
```

# 配置 Prometheus

## 安装 Prometheus

在 [Prometheus 文档](https://prometheus.io/docs/introduction/overview/)中可了解相关背景知识。
如果你的集群中没有 Prometheus，可用如下步骤在 `deepflow-prometheus-demo` 命名空间中快速部署一个 Prometheus：
```bash
# add helm chart
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# install prometheus
helm install prometheus prometheus-community/prometheus -n deepflow-prometheus-demo --create-namespace
```

## 配置 remote_write

我们需要配置 Prometheus `remote_write`，将数据发送给 DeepFlow Agent。

首先确定 DeepFlow Agent 启动的数据监听服务的地址。在[安装 DeepFlow Agent](../../install/single-k8s/) 后，会显示 DeepFlow Agent Service 地址，它的默认值是 `deepflow-agent.default`，请根据实际的服务名称与命名空间填写到配置中。

执行以下命令可修改 Prometheus 的默认配置（假设它在 `deepflow-prometheus-demo` 中）：
```bash
kubectl edit cm -n deepflow-prometheus-demo prometheus-server
```

配置 `remote_write` 地址（请修改 `DEEPFLOW_AGENT_SVC`）：
```yaml
remote_write:
  - url: http://${DEEPFLOW_AGENT_SVC}/api/v1/prometheus
```

## 配置 remote_read

如果希望 Prometheus 从 DeepFlow 查询数据，需要配置 Prometheus 的 `remote_read`（请修改 `DEEPFLOW_SERVER_SVC`）：
```yaml
remote_read:
  - url: http://${DEEPFLOW_SERVER_SVC}/api/v1/prom/read
    read_recent: true
```

# 配置 DeepFlow

请参考[配置 DeepFlow](../tracing/opentelemetry/#配置-deepflow) 一节内容，并添加配置 `prometheus targets api` 地址（v6.2 及以前版本不需要配置），完成 DeepFlow Agent 配置。目的是将 prometheus activeTargets.labels 和 config 同步到 deepflow-server controller，以提升存储和查询性能。添加以下配置到采集组配置中（请修改 `PROMETHEUS_HTTP_API_ADDRESSES`）:
```yaml
prometheus_http_api_addresses: # 集成 Prometheus 指标时需填写此项
- {PROMETHEUS_HTTP_API_ADDRESSES} 
```

# 查看 Prometheus 数据

Prometheus 中的指标将会存储在 DeepFlow 的 `ext_metrics` database 中。为了降低 table 的数量，
DeepFlow 会将指标名称按 `_` 分隔后取前 N 节（默认取前 1 节），将拥有相同前缀的指标合并在一个 table 中。

DeepFlow 会将 Prometheus 的原始标签保存在 tag.X 中，原始指标保存在 int.X 或 float.X 中。
使用 Grafana，选择 `DeepFlow` 数据源进行搜索时的展现图下图：

![Prometheus 集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304413f01a5c.png)

除此之外 DeepFlow 还会向每个数据中依靠 [AutoTagging](./metrics-auto-tagging/) 自动注入大量标签，
使得 Prometheus 采集的数据可以与其他数据源无缝关联。
