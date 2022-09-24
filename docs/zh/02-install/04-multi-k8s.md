---
title: 监控多个 K8s 集群
permalink: /install/multi-k8s
---

# 简介

DeepFlow Server 可服务于多个 K8s 集群中的 DeepFlow Agent。假设你在一个 K8s 集群中已经部署好了 DeepFlow Server，本章介绍如何监控其他的 K8s 集群。

# 准备工作

## 部署拓扑

```mermaid
flowchart LR

subgraph K8s-Cluster-1
  DeepFlowServer["deepflow-server (statefulset)"]
  DeepFlowAgent1["deepflow-agent (daemonset)"]
  DeepFlowAgent1 -->|load balancing| DeepFlowServer
end

subgraph K8s-Cluster-2
  DeepFlowAgent2["deepflow-agent (daemonset)"]
  DeepFlowAgent2 -->|load balancing| DeepFlowServer
end
```

## 确保不同 K8s 集群可区分

DeepFlow 使用 K8s 的 CA 文件 MD5 值区分不同的集群，请在不同 K8s 集群的 Pod 中查看 `/run/secrets/kubernetes.io/serviceaccount/ca.crt` 文件，确保不同集群的 CA 文件不同。

假如你的不同 K8s 集群使用了相同的 CA 文件，在多个集群中部署 deepflow-agent 之前，需要利用 `deepflow-ctl domain create` 获取一个 `K8sClusterID`：
```bash
unset CLUSTER_NAME
CLUSTER_NAME="k8s-1"  # FIXME: K8s cluster name
cat << EOF | deepflow-ctl domain create -f -
name: $CLUSTER_NAME
type: kubernetes
EOF
deepflow-ctl domain list $CLUSTER_NAME  # Get K8sClusterID
```

# 部署 deepflow-agent

使用 Helm 安装 deepflow-agent：
```bash
DEEPFLOW_SERVER_NODE_IPS="10.1.2.3,10.4.5.6"  # FIXME: K8s Node IPs

helm repo add deepflow https://deepflowys.github.io/deepflow
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm install deepflow-agent -n deepflow deepflow/deepflow-agent --create-namespace \
    --set deepflowServerNodeIPS={$DEEPFLOW_SERVER_NODE_IPS}
```

因此上述部署过程中需要将 deepflow-agent 的 `deepflowServerNodeIps` 配置为 K8s 集群的一个或多个 Node IP。

注意：
- 若不同 K8s 集群的 CA 文件一样，部署时需要传入使用 `deepflow-ctl` 获取到的 `kubernetesClusterId`：
  ```bash
  DEEPFLOW_K8S_CLUSTER_ID="fffffff"              # FIXME: Generate by `deepflow-ctl domain create`
  helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent  \
      --set deepflowK8sClusterID=$DEEPFLOW_K8S_CLUSTER_ID \
      --reuse-values
  ```
- 我们建议将 helm 的 `--set` 参数内容保存一个独立的 yaml 文件中，参考[高级配置](./advanced-config/server-advanced-config/)章节。

# 下一步

- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无盲点分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)
