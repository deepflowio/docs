---
title: DeepFlow 升级
permalink: /install/upgrade/
---

# 简介

升级 DeepFlow 至最新版本及获取最新的 Grafana dashboard。

# 升级 DeepFlow Server

通过 Helm 一键升级 DeepFlow Server 及本集群的 DeepFlow Agent：

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
```

# 升级 DeepFlow CLI

下载最新的 deepflow-ctl:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/amd64/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# 升级 DeepFlow Agent

## 升级 K8s 集群中的 Agent

通过 Helm 一键升级 DeepFlow Agent：

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent -f values-custom.yaml
```

## 远程升级云服务器中的 Agent

TODO

# 获取最新 DeepFlow Grafana dashboard

检查 Grafana 的 init container `init-grafana-ds-dh` 的镜像是否为 `latest`, 镜像拉取策略是否为 `Always`:

```bash
kubectl get deployment -n deepflow deepflow-grafana -o yaml|grep -E 'image:|imagePullPolicy'
```

若 Grafana 的 init container `init-grafana-ds-dh` 的镜像不是 `latest`, 镜像拉取策略不是 `Always`，请修改为 `latest` 和 `Always`。

重启 Grafana , 拉取最新的 init container `init-grafana-ds-dh` 镜像，获取最新的 dashboard ：

```bash
kubectl delete pods -n deepflow -l app.kubernetes.io/instance=deepflow -l app.kubernetes.io/name=grafana
```