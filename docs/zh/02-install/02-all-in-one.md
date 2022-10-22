---
title: All-in-One 快速部署
permalink: /install/all-in-one
---

# 简介

虽然 deepflow-agent 可运行于各种环境中，但 deepflow-server 必须运行在 K8s 之上。本章我们从一个 All-in-One K8s 集群出发，介绍如何部署一个 DeepFlow 的体验环境。

# 准备工作

## 资源需求

- 建议部署使用的虚拟机最低规格为 4C8G

## 部署 All-in-One K8s

使用 [sealos](https://github.com/labring/sealos) 快速部署一个 K8s 集群：
```bash
# install sealos
curl -o /usr/bin/sealos https://deepflow-ce.oss-cn-beijing.aliyuncs.com/sealos/sealos && \
    chmod +x /usr/bin/sealos

# install All-in-One kubernetes cluster
IP_ADDR="1.2.3.4"  # FIXME: Your IP address
PASSWORD="x"       # FIXME: Your SSH root password
sealos run labring/kubernetes:v1.24.0 labring/calico:v3.22.1 --masters $IP_ADDR -p $PASSWORD

# remove kubernetes node taint
kubectl taint node node-role.kubernetes.io/master- node-role.kubernetes.io/control-plane- --all
```

## 安装 Helm

DeepFlow 使用 [Helm](https://helm.sh/) 进行部署，安装方法为：
```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

也可使用 sealos 安装 helm：
```bash
sealos run labring/helm:v3.8.2
```

# 部署 All-in-One DeepFlow

使用 Helm 安装 All-in-One DeepFlow：

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
helm repo add deepflow https://deepflowys.github.io/deepflow
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
cat << EOF > values-custom.yaml
global:
  allInOneLocalStorage: true
EOF
helm install deepflow -n deepflow deepflow/deepflow --create-namespace \
  -f values-custom.yaml
```

@tab Use Aliyun

```bash
helm repo add deepflow https://deepflow-ce.oss-cn-beijing.aliyuncs.com/chart/stable
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
cat << EOF > values-custom.yaml
global:
  allInOneLocalStorage: true
  image:
      repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
grafana:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
EOF
helm install deepflow -n deepflow deepflow/deepflow --create-namespace \
  -f values-custom.yaml
```

:::

注意：
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
