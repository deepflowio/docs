---
title: All-in-One 快速部署
---

# 简介

虽然 metaflow-agent 可运行于各种环境中，但 metaflow-server 仅能运行在 K8s 之上。因此本章我们从一个 All-in-One K8s 集群出发，介绍如何部署一个 MetaFlow 的体验环境。

# 准备工作

## 资源需求

- 建议部署使用的虚拟机最低规格为 4C8G
- 基于 eBPF 的 AutoTracing 能力要求 Linux Kernel 4.14+

## 部署 All-in-One K8s

使用 [sealos](https://github.com/labring/sealos) 快速部署一个 K8s 集群：
```console
# install sealos
curl -o /usr/bin/sealos https://sealyun-home.oss-cn-beijing.aliyuncs.com/sealos-4.0/latest/sealos-amd64 && \
    chmod +x /usr/bin/sealos

# install All-in-One kubernetes cluster
IP_ADDR="1.2.3.4"  # FIXME: Your IP address
PASSWORD="x"       # FIXME: Your SSH root password
sealos run labring/kubernetes:v1.24.0 labring/calico:v3.22.1 --masters $IP_ADDR -p $PASSWORD

# remove kubernetes node taint
kubectl taint node node-role.kubernetes.io/master- node-role.kubernetes.io/control-plane- --all
```

## 安装 Helm

MetaFlow 使用 [Helm](https://helm.sh/) 进行部署，安装方法为：
```console
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

也可使用 sealos 安装 helm：
```console
sealos run labring/helm:v3.8.2
```

# 部署 All-in-One MetaFlow

使用 Helm 安装 All-in-One MetaFlow：
```console
helm repo add metaflow https://metaflowys.github.io/metaflow
helm repo update metaflow
helm install metaflow -n metaflow metaflow/metaflow --create-namespace \
    --set global.allInOneLocalStorage=true
```

# 下一步

- [自动分布式追踪 - 体验 MetaFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/overview.html)
- [微服务全景图 - 体验 MetaFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/overview.html)
- [消除数据孤岛 - 了解 MetaFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos.html)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/overview.html)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/overview.html)
