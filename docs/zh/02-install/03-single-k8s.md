---
title: 监控单个 K8s 集群
permalink: /install/single-k8s
---

# 简介

假如你在一个 K8s 集群中部署了应用，本章介绍如何使用 DeepFlow 进行监控。
DeepFlow 能够自动采集所有 Pod 的应用和网络观测数据（AutoMetrics、AutoTracing），
并基于调用 apiserver 获取的信息自动为所有观测数据注入`K8s 资源`和`K8s 自定义 Label`标签（AutoTagging）。

# 准备工作

## 部署拓扑

```mermaid
flowchart TD

subgraph K8s-Cluster
  APIServer["k8s apiserver"]

  subgraph DeepFlow Backend
    DeepFlowServer["deepflow-server (statefulset)"]
    ClickHouse["clickhouse (statefulset)"]
    MySQL["mysql (deployment)"]
    DeepFlowApp["deepflow-app (deployment)"]
    Grafana["grafana (deployment)"]
  end

  subgraph DeepFlow Frontend
    DeepFlowAgent["deepflow-agent (daemonset)"]
  end

  DeepFlowAgent -->|"control & data"| DeepFlowServer
  DeepFlowAgent -->|"get resource & label"| APIServer

  DeepFlowServer --> ClickHouse
  DeepFlowServer --> MySQL
  DeepFlowApp -->|sql| DeepFlowServer
  Grafana -->|"metrics/logging (sql)"| DeepFlowServer
  Grafana -->|"tracing (api)"| DeepFlowApp
end
```

## Storage Class

我们建议使用 Persistent Volumes 来保存 MySQL 和 ClickHouse 的数据，以避免不必要的维护成本。
你可以提供默认 Storage Class 或添加 `--set global.storageClass=<your storageClass>` 参数来选择 Storage Class 以创建 PVC。

可选择 [OpenEBS](https://openebs.io/) 用于创建 PVC：
```bash
kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
## config default storage class
kubectl patch storageclass openebs-hostpath  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

## deepflow-agent 权限需求

deepflow-agent 要求所在容器节点的配置如下：
- `selinux` = `Permissive` OR `disabled`

deepflow-agent 作为 DaemonSet 部署时将会打开它的如下权限：
- `hostNetwork`
- `hostPID`
- `privileged`
- Write `/sys/kernel/debug`

deepflow-agent 同步 K8s 资源和 Label 信息时需要以下资源的 get/list/watch 权限：
- `nodes`
- `namespaces`
- `configmaps`
- `services`
- `pods`
- `replicationcontrollers`
- `daemonsets`
- `deployments`
- `replicasets`
- `statefulsets`
- `ingresses`
- `routes`

# 部署 DeepFlow

使用 Helm 安装 DeepFlow：
```bash
helm repo add deepflow https://deepflowys.github.io/deepflow # use aliyun helm repo `https://deepflow-ce.oss-cn-beijing.aliyuncs.com/chart/stable`
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm install deepflow -n deepflow deepflow/deepflow --create-namespace
```

注意：
- 使用 helm --set global.storageClass 可指定 storageClass
- 使用 helm --set global.replicas 可指定 deepflow-server 和 clickhouse 的副本数量
- 我们建议将 helm 的 `--set` 参数内容保存一个独立的 yaml 文件中，参考[高级配置](./advanced-config/server-advanced-config/)章节。

# 下载 deepflow-ctl

deepflow-ctl 是管理 DeepFlow 的一个命令行工具，建议下载至 deepflow-server 所在的 K8s Node 上，用于后续使用：
```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/amd64/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# 访问 Grafana 页面

执行 helm 部署 DeepFlow 时输出的内容提示了获取访问 Grafana 的 URL 和密码的命令，输出示例：
```bash
NODE_PORT=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-grafana)
NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo -e "Grafana URL: http://$NODE_IP:$NODE_PORT  \nGrafana auth: admin:deepflow"
```

执行上述命令后的输出示例：
```text
Grafana URL: http://10.1.2.3:31999
Grafana auth: admin:deepflow
```

# 下一步

- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无盲点分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)
