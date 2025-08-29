---
title: All-in-One 快速部署
permalink: /ce-install/all-in-one
---

# 简介

为了方便安装部署，我们为 deepflow-server 提供了 Kubernetes 和 Docker Compose 两种部署方式。本章我们从一个 All-in-One DeepFlow 出发，介绍如何部署一个 DeepFlow 的体验环境。

# 使用 Kubernetes 部署

## 准备工作

### 资源需求

- 建议部署使用的虚拟机最低规格为 4C8G

### 部署 All-in-One K8s

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

### 安装 Helm

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

## 部署 All-in-One DeepFlow

使用 Helm 安装 LTS 版本 All-in-One DeepFlow：

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
helm repo add deepflow https://deepflowio.github.io/deepflow
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
cat << EOF > values-custom.yaml
global:
  allInOneLocalStorage: true
EOF
helm install deepflow -n deepflow deepflow/deepflow --version 6.6.018 --create-namespace -f values-custom.yaml
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
EOF
helm install deepflow -n deepflow deepflow/deepflow --version 6.6.018 --create-namespace -f values-custom.yaml
```

:::

注意：

- 我们建议将 helm 的 `--set` 参数内容保存一个独立的 yaml 文件中，参考[高级配置](../best-practice/server-advanced-config/)章节。

## 访问 Grafana 页面

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

# 使用 Docker Compose 部署

我们不推荐使用 Docker 部署 DeepFlow Server 端，具体原因如下：

1. Server 端依赖 K8s 的 [lease](https://kubernetes.io/zh-cn/docs/concepts/architecture/leases/) 进行选主，通过多副本实现高可用性。而 Docker 环境缺乏 K8s 的这一机制，导致 Server 端仅能以单副本模式运行。在 Agent 节点数量较多或数据采集量较大的场景下，单副本实例可能因资源瓶颈而无法承载高并发的数据量。
2. 当 Server 端以单副本形式部署时，配套的 ClickHouse 只能采用单切片形式部署，否则会导致数据写入不均衡，这在一定程度上限制了数据的查询速度。

## 准备工作

### 资源需求

- 建议部署使用的虚拟机最低规格为 4C8G

### 部署 Docker

参考 [Docker](https://docs.docker.com/engine/install/) 文档部署 Docker：

```bash
curl -fsSL https://get.docker.com -o install-docker.sh
sudo sh install-docker.sh
```

### 部署 Docker Compose

参考 [Docker Compose](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually) 文档部署 Docker：

```bash
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

## 部署 All-in-One DeepFlow

下载 DeepFlow docker-compose 包

```bash
wget  https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/docker-compose/latest/linux/deepflow-docker-compose.tar
tar -zxf deepflow-docker-compose.tar
```

配置`.env`变量

```bash
vim ./deepflow-docker-compose/.env
DEEPFLOW_VERSION=v6.6  # FIXME: DeepFlow Version
NODE_IP_FOR_DEEPFLOW=192.168.101.116  # FIXME: Node IP
```

安装 DeepFlow

```bash
docker compose -f deepflow-docker-compose/docker-compose.yaml up -d
```

## 部署 DeepFlow Agent

参考 [监控传统服务器](./legacy-host) 为该服务器部署 deepflow-agent。

## 访问 Grafana 页面

通过 docker compose 部署后，将浏览器指向 `http://<$NODE_IP_FOR_DEEPFLOW>:3000` 即可登录 Grafana 控制台

默认凭据：

- 用户名：admin
- 密码：deepflow

# 下载 deepflow-ctl

deepflow-ctl 是 DeepFlow 的命令行管理工具，建议部署至 deepflow-server 所在的 K8s Node 上，以便后续用于 Agent [组配置管理](../best-practice/agent-advanced-config)及其他运维操作：

```bash
# 与当前 server 版本同步即可
Version=v6.6

# 使用变量下载
curl -o /usr/bin/deepflow-ctl \
  "https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/$Version/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl"

# 添加执行权限
chmod a+x /usr/bin/deepflow-ctl
```

# 下一步

- [服务全景图 - 体验 DeepFlow 的 AutoMetrics 能力](../features/universal-map/auto-metrics/)
- [分布式追踪 - 体验 DeepFlow 的 AutoTracing 能力](../features/distributed-tracing/auto-tracing/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../features/auto-tagging/eliminate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/input/metrics/metrics-auto-tagging/)
- [全栈分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/input/tracing/full-stack-distributed-tracing/)
