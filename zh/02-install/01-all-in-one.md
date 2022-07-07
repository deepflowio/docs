---
title: All-in-One 快速部署
---

# 简介

虽然 metaflow-agent 可运行于各种环境中，但 metafloe-server 仅能运行在 K8s 之上。
因此本章我们从一个 All-in-One K8s 集群出发，介绍如何部署一个 MetaFlow 的体验环境。

# 部署 All-in-One K8s

使用 [sealos](https://github.com/labring/sealos) 快速部署一个 K8s 集群：
```console
# install sealos
wget -c https://sealyun-home.oss-cn-beijing.aliyuncs.com/sealos/latest/sealos && \
    chmod +x sealos && mv sealos /usr/bin

# k8s version
K8S_VERSION="1.22.0"

# download k8s tar ball
# @建昌，能否选择在线安装，因为下面的链接有硬编码
wget -c https://sealyun.oss-cn-beijing.aliyuncs.com/05a3db657821277f5f3b92d834bbaf98-v1.22.0/kube${K8S_VERSION}.tar.gz

# install All-in-One kubernetes cluster
sealos init --passwd '<Your passwoed>' \
	--master <Your IP address> \
	--pkg-url /root/kube${K8S_VERSION}.tar.gz \
	--version v${K8S_VERSION}
```

# 安装 Helm

MetaFlow 使用 [Helm](https://helm.sh/) 进行部署，安装方法为：
```console
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

# 部署 All-in-One MetaFlow

使用Helm安装一个 All-in-One MetaFlow：
```console
helm repo add metaflow https://metaflowys.github.io/metaflow
helm repo udpate metaflow
helm install metaflow -n metaflow metaflow/metaflow --create-namespace
```

# 下一步

- [自动分布式追踪 - 体验 MetaFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/overview.html)
- [微服务全景图 - 体验 MetaFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/overview.html)
- [消除数据孤岛 - 了解 MetaFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos.html)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/tracing/overview.html)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/metrics/overview.html)
