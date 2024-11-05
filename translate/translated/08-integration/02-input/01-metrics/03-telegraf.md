---
title: Integrating Telegraf Data
permalink: /integration/input/metrics/telegraf
---

> This document was translated by ChatGPT

# Data Flow

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

# Configuring Telegraf

## Installing Telegraf

You can learn the relevant background knowledge in the [Telegraf documentation](https://www.influxdata.com/time-series-platform/telegraf/).
If your cluster does not have Telegraf, you can quickly deploy Telegraf as a DaemonSet using the following steps:

```bash
# add helm chart
helm repo add influxdata https://helm.influxdata.com/

# install telegraf
helm upgrade --install telegraf influxdata/telegraf -n deepflow-telegraf-demo --create-namespace

# switch from deployment to daemonset
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/DeepFlow-Telegraf-Demo/deepflow-telegraf-demo.yaml
```

## Configuring Telegraf Data Output

We need to modify Telegraf's configuration to send data to the DeepFlow Agent.

First, we need to determine the address of the data listening service started by the DeepFlow Agent. After [installing the DeepFlow Agent](../../../ce-install/single-k8s/),
the DeepFlow Agent Service address will be displayed, with a default value of `deepflow-agent.default`.
If you have modified it, please fill in the actual service name and namespace in the configuration.

Next, modify Telegraf's default configuration (assuming it is in the `deepflow-telegraf-demo` namespace):

```bash
kubectl edit cm -n deepflow-telegraf-demo telegraf
```

In `telegraf.conf`, add the following configuration (please change `DEEPFLOW_AGENT_SVC` to the service name of deepflow-agent):

```toml
[[outputs.http]]
  url = "http://${DEEPFLOW_AGENT_SVC}/api/v1/telegraf"
  data_format = "influx"
```

# Configuring DeepFlow

Please refer to the section [Configuring DeepFlow](../tracing/opentelemetry/#配置-deepflow) to complete the DeepFlow Agent configuration.

# Viewing Telegraf Data

Metrics from Telegraf will be stored in DeepFlow's `ext_metrics` database.
To reduce the number of tables, DeepFlow will store all Measurements in a single ClickHouse Table,
but users will still see a series of data tables corresponding to the original Telegraf Measurements.
The original tags of Telegraf metrics can be referenced via tag.XXX, and metric values can be referenced via metrics.YYY.
At the same time, DeepFlow will automatically inject a large number of Meta Tags and Custom Tags, allowing Telegraf-collected data to be seamlessly associated with other data sources.

Using Grafana, select the `DeepFlow` data source to display the search results as shown below:

![Telegraf Data Integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231003651c1adb93461.png)