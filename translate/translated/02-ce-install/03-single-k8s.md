---
title: Monitoring a Single K8s Cluster
permalink: /ce-install/single-k8s
---

> This document was translated by ChatGPT

# Introduction

If you have deployed applications in a K8s cluster, this chapter introduces how to use DeepFlow for monitoring.
DeepFlow can collect observability signals (AutoMetrics, AutoTracing, AutoProfiling) from all Pods with zero intrusion,
and automatically inject `K8s resources` and `K8s custom labels` tags (AutoTagging) into all observability data based on information obtained from the apiserver.

# Preparation

## Deployment Topology

```mermaid
flowchart TD

subgraph K8s-Cluster
  APIServer["k8s apiserver"]

  subgraph DeepFlow Backend
    DeepFlowServer["deepflow-server (deployment)"]
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

We recommend using Persistent Volumes to store MySQL and ClickHouse data to avoid unnecessary maintenance costs.
You can provide a default Storage Class or add the `--set global.storageClass=<your storageClass>` parameter to select a Storage Class for creating PVC.

You can choose [OpenEBS](https://openebs.io/) to create PVC:

```bash
kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
## config default storage class
kubectl patch storageclass openebs-hostpath  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

# Deploy DeepFlow

Install DeepFlow using Helm:

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
helm repo add deepflow https://deepflowio.github.io/deepflow
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm install deepflow -n deepflow deepflow/deepflow --create-namespace
```

@tab Use Aliyun

```bash
helm repo add deepflow https://deepflow-ce.oss-cn-beijing.aliyuncs.com/chart/stable
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
cat << EOF > values-custom.yaml
global:
  image:
      repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
EOF
helm install deepflow -n deepflow deepflow/deepflow --create-namespace \
  -f values-custom.yaml
```

:::

Note:

- Use helm --set global.storageClass to specify the storageClass
- Use helm --set global.replicas to specify the number of replicas for deepflow-server and clickhouse
- We recommend saving the contents of the helm `--set` parameters in a separate yaml file, refer to the [Advanced Configuration](../best-practice/server-advanced-config/) section.

# Download deepflow-ctl

deepflow-ctl is a command-line tool for managing DeepFlow. It is recommended to download it to the K8s Node where deepflow-server is located for subsequent use:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Access the Grafana Page

The output of the helm deployment of DeepFlow provides commands to get the URL and password for accessing Grafana. Example output:

```bash
NODE_PORT=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-grafana)
NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo -e "Grafana URL: http://$NODE_IP:$NODE_PORT  \nGrafana auth: admin:deepflow"
```

Example output after executing the above commands:

```text
Grafana URL: http://10.1.2.3:31999
Grafana auth: admin:deepflow
```

# Next Steps

- [Universal Service Map - Experience DeepFlow's AutoMetrics capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing capability](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Silos - Learn about DeepFlow's AutoTagging and SmartEncoding capabilities](../features/auto-tagging/eliminate-data-silos/)
- [Say Goodbye to High Latency - Integrate metrics data like Prometheus](../integration/input/metrics/metrics-auto-tagging/)
- [Full-Stack Distributed Tracing - Integrate tracing data like OpenTelemetry](../integration/input/tracing/full-stack-distributed-tracing/)
