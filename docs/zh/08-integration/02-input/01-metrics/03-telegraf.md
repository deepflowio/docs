---
title: 集成 Telegraf 数据
permalink: /integration/input/metrics/telegraf
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  Telegraf1["telegraf (daemonset)"]
  DeepFlowAgent1["deepflow-agent (daemonset)"]
  DeepFlowServer["deepflow-server (deployment)"]

  Telegraf1 -->|metrics| DeepFlowAgent1
  DeepFlowAgent1 -->|metrics| DeepFlowServer
end

subgraph Host
  Telegraf2[telegraf]
  DeepFlowAgent2[deepflow-agent]

  Telegraf2 -->|metrics| DeepFlowAgent2
  DeepFlowAgent2 -->|metrics| DeepFlowServer
end
```

# 配置 Telegraf

## 安装 Telegraf

在 [Telegraf 文档](https://www.influxdata.com/time-series-platform/telegraf/)中可了解相关背景知识。
如果你的集群中没有 Telegraf，可用如下步骤快速以 DaemonSet 方式部署 Telegraf：

```bash
# add helm chart
helm repo add influxdata https://helm.influxdata.com/

# install telegraf
helm upgrade --install telegraf influxdata/telegraf -n deepflow-telegraf-demo --create-namespace

# switch from deployment to daemonset
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/DeepFlow-Telegraf-Demo/deepflow-telegraf-demo.yaml
```

## 配置 Telegraf 数据输出

我们需要修改 Telegraf 的配置，使 Telegraf 将数据发送给 DeepFlow Agent。

首先，我们需要确定 DeepFlow Agent 启动的数据监听服务的地址。在[安装 DeepFlow Agent](../../../ce-install/single-k8s/) 后，
会显示 DeepFlow Agent Service 地址，它的默认值是 `deepflow-agent.default`。
如果你修改了它，请根据实际的服务名称与命名空间填写到配置中。

接下来修改 Telegraf 的默认配置（假设它位于 `deepflow-telegraf-demo` 命名空间中）：

```bash
kubectl edit cm -n deepflow-telegraf-demo telegraf
```

在 `telegraf.conf` 中，增加如下配置（请修改 `DEEPFLOW_AGENT_SVC` 为 deepflow-agent 的服务名）：

```toml
[[outputs.http]]
  url = "http://${DEEPFLOW_AGENT_SVC}/api/v1/telegraf"
  data_format = "influx"
```

# 配置 DeepFlow

请参考 [配置 DeepFlow](../tracing/opentelemetry/#配置-deepflow) 一节内容，完成 DeepFlow Agent 配置。

# 查看 Telegraf 数据

Telegraf 中的指标将会存储在 DeepFlow 的 `ext_metrics` database 中。
为了降低 table 的数量，DeepFlow 会将所有 Measurement 存储在一个 ClickHouse Table 中，
当用户使用时仍然看到的是一系列对应到 Telegraf 原始 Measurement 的数据表。
Telegraf 指标原有的标签可通过 tag.XXX 引用，指标值通过 metrics.YYY 引用。
同时 DeepFlow 也会自动注入大量的 Meta Tag 和 Custom Tag，使得 Telegraf 采集的数据可以与其他数据源无缝关联。

使用 Grafana，选择 `DeepFlow` 数据源进行搜索时的展现图下图：

![Telegraf 数据集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231003651c1adb93461.png)
