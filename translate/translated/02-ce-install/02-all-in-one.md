---
title: All-in-One Quick Deployment
permalink: /ce-install/all-in-one
---

> This document was translated by ChatGPT

# Introduction

To facilitate installation and deployment, we provide two deployment methods for deepflow-server: Kubernetes and Docker Compose. In this chapter, we will start with an All-in-One DeepFlow and introduce how to deploy a DeepFlow experience environment.

# Deploy Using Kubernetes

## Preparation

### Resource Requirements

- It is recommended that the minimum specifications for the virtual machine used for deployment are 4C8G.

### Deploy All-in-One K8s

Quickly deploy a K8s cluster using [sealos](https://github.com/labring/sealos):

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

### Install Helm

DeepFlow uses [Helm](https://helm.sh/) for deployment. The installation method is:

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

You can also use sealos to install helm:

```bash
sealos run labring/helm:v3.8.2
```

## Deploy All-in-One DeepFlow

Install the LTS version of All-in-One DeepFlow using Helm:

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

Note:

- We recommend saving the contents of the helm `--set` parameter in a separate yaml file, as referenced in the [Advanced Configuration](../best-practice/server-advanced-config/) section.

## Access the Grafana Page

The output from executing helm to deploy DeepFlow provides commands to obtain the URL and password for accessing Grafana. Example output:

```bash
NODE_PORT=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-grafana)
NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo -e "Grafana URL: http://$NODE_IP:$NODE_PORT  \nGrafana auth: admin:deepflow"
```

Example output after executing the above command:

```text
Grafana URL: http://10.1.2.3:31999
Grafana auth: admin:deepflow
```

# Deploy Using Docker Compose

We do not recommend using Docker to deploy the DeepFlow Server side for the following reasons:

1. The Server side relies on K8s [lease](https://kubernetes.io/docs/concepts/architecture/leases/) for leader election, achieving high availability through multiple replicas. The Docker environment lacks this mechanism, causing the Server side to run only in single-replica mode. In scenarios with a large number of Agent nodes or high data collection volume, a single-replica instance may not handle high concurrent data volumes due to resource bottlenecks.
2. When the Server side is deployed in single-replica mode, the accompanying ClickHouse can only be deployed in a single-shard form, otherwise, it will lead to uneven data writing, which limits the data query speed to some extent.

## Preparation

### Resource Requirements

- It is recommended that the minimum specifications for the virtual machine used for deployment are 4C8G.

### Deploy Docker

Refer to the [Docker](https://docs.docker.com/engine/install/) documentation to deploy Docker:

```bash
curl -fsSL https://get.docker.com -o install-docker.sh
sudo sh install-docker.sh
```

### Deploy Docker Compose

Refer to the [Docker Compose](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually) documentation to deploy Docker:

```bash
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

## Deploy All-in-One DeepFlow

Download the DeepFlow docker-compose package

```bash
wget  https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/docker-compose/latest/linux/deepflow-docker-compose.tar
tar -zxf deepflow-docker-compose.tar
```

Configure the `.env` variables

```bash
vim ./deepflow-docker-compose/.env
DEEPFLOW_VERSION=v6.6  # FIXME: DeepFlow Version
NODE_IP_FOR_DEEPFLOW=192.168.101.116  # FIXME: Node IP
```

Install DeepFlow

```bash
docker compose -f deepflow-docker-compose/docker-compose.yaml up -d
```

## Deploy DeepFlow Agent

Refer to [Monitor Traditional Servers](./legacy-host) to deploy deepflow-agent on this server.

## Access the Grafana Page

After deploying through docker compose, point your browser to `http://<$NODE_IP_FOR_DEEPFLOW>:3000` to log in to the Grafana console.

Default credentials:

- Username: admin
- Password: deepflow

# Download deepflow-ctl

deepflow-ctl is the command-line management tool for DeepFlow. It is recommended to deploy it on the K8s Node where deepflow-server is located for subsequent use in Agent [group configuration management](../best-practice/agent-advanced-config) and other maintenance operations:

```bash
# Sync with the current server version
Version=v6.6

# Download using variables
curl -o /usr/bin/deepflow-ctl \
  "https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/$Version/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl"

# Add execution permissions
chmod a+x /usr/bin/deepflow-ctl
```

# Next Steps

- [Universal Service Map - Experience DeepFlow's AutoMetrics Capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing Capability](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Silos - Learn About DeepFlow's AutoTagging and SmartEncoding Capabilities](../features/auto-tagging/eliminate-data-silos/)
- [Say Goodbye to High Base Troubles - Integrate Metrics Data Such as Prometheus](../integration/input/metrics/metrics-auto-tagging/)
- [Full-Stack Distributed Tracing - Integrate Tracing Data Such as OpenTelemetry](../integration/input/tracing/full-stack-distributed-tracing/)