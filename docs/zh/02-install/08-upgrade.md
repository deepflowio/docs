---
title: DeepFlow 升级
permalink: /install/upgrade/
---

# 简介

升级 DeepFlow 至最新版本及获取最新的 Grafana dashboard。

# 升级 DeepFlow Server

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
```

# 升级 DeepFlow Agent

通过 deepflow-ctl 升级云服务器和传统服务器上部署的 DeepFlow Agent：

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/stable/linux/amd64/deepflow-agent.tar.gz
tar -zxvf deepflow-agent.tar.gz -C /usr/sbin/
deepflow-ctl agent list # get your cloud-host and legacy-host agent name
for AGENT in $(deepflow-ctl agent list | grep -v NAME | awk '{print $1}')
  do 
    deepflow-ctl agent-upgrade $AGENT --package=/usr/sbin/deepflow-agent
  done
```

检查 K8s 中的 Agent 是否有因版本不匹配导致的重启：

```bash
kubectl  logs -n deepflow deepflow-agent-XXXX -p | grep upgrade
```

若有，需要通过 Helm 或修改 deepflow-agent 的 DaemonSet image 字段升级至已发布的最新版本。

升级 K8s 集群中部署的 DeepFlow Agent：

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent -f values-custom.yaml
```

# 获取最新 DeepFlow Grafana dashboard

检查 Grafana 的 init container 的镜像是否为 `latest`, 镜像拉取策略是否为 `Always`:

```bash
kubectl get deployment -n deepflow deepflow-grafana -o yaml|grep -E 'image:|imagePullPolicy'
```

若 Grafana 的 init container 的镜像不是 `latest`, 镜像拉取策略不是 `Always`，请修改为`latest`和 `Always`。

重启 Grafana , 拉取最新的 init container 镜像，获取最新的 dashboard ：

```bash
kubectl delete pods -n deepflow -l app.kubernetes.io/instance=deepflow -l app.kubernetes.io/name=grafana
```

# 下一步

- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无盲点分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)
