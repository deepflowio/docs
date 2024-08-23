---
title: All-in-One Quick Deployment
permalink: /ce-install/all-in-one
---

> This document was translated by ChatGPT

# Introduction

To facilitate installation and deployment, we provide two deployment methods for deepflow-server: Kubernetes and Docker Compose. In this chapter, we will start with an All-in-One DeepFlow and introduce how to deploy a DeepFlow experience environment.

# Deploying with Kubernetes

## Preparation

### Resource Requirements

- It is recommended that the minimum specifications for the virtual machine used for deployment are 4C8G.

### Deploy All-in-One K8s

Use [sealos](https://github.com/labring/sealos) to quickly deploy a K8s cluster:

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

Use Helm to install All-in-One DeepFlow:

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
helm repo add deepflow https://deepflowio.github.io/deepflow
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
EOF
helm install deepflow -n deepflow deepflow/deepflow --create-namespace \
  -f values-custom.yaml
```

:::

Note:

- We recommend saving the contents of the helm `--set` parameter in a separate yaml file, refer to the [Advanced Configuration](../best-practice/server-advanced-config/) section.

## Access Grafana Page

The output of the helm deployment of DeepFlow provides commands to get the URL and password for accessing Grafana. Example output:

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

# Deploying with Docker Compose

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

Set the environment variable DOCKER_HOST_IP to the IP of the physical network card of the machine

```bash
unset DOCKER_HOST_IP
DOCKER_HOST_IP="10.1.2.3"  # FIXME: Deploy the environment machine IP
```

Download and install All-in-One DeepFlow

```bash
wget  https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/docker-compose/latest/linux/deepflow-docker-compose.tar
tar -zxf deepflow-docker-compose.tar
sed -i "s|FIX_ME_ALLINONE_HOST_IP|$DOCKER_HOST_IP|g" deepflow-docker-compose/docker-compose.yaml
docker compose -f deepflow-docker-compose/docker-compose.yaml up -d
```

## Deploy DeepFlow Agent

Refer to [Monitoring Traditional Servers](./legacy-host) to deploy deepflow-agent for this server.

## Access Grafana Page

The port for DeepFlow Grafana deployed using Docker Compose is 3000, and the user password is admin:deepflow.

For example, if the machine's IP is 10.1.2.3, the Grafana access URL is http://10.1.2.3:3000

## Limitations

- In this deployment mode, both deepflow-server and clickhouse do not support horizontal scaling.
- Since some capabilities of deepflow-server rely on Kubernetes, the docker-compose deployment mode cannot monitor cloud servers. You can refer to [Monitoring Traditional Servers](./legacy-host) to monitor cloud hosts.

# Download deepflow-ctl

deepflow-ctl is a command-line tool for managing DeepFlow. It is recommended to download it to the K8s Node where deepflow-server is located for subsequent use:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Next Steps

- [Universal Service Map - Experience DeepFlow's AutoMetrics Capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing Capability](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Silos - Learn about DeepFlow's AutoTagging and SmartEncoding Capabilities](../features/auto-tagging/eliminate-data-silos/)
- [Say Goodbye to High Baseline Troubles - Integrate Prometheus and other metric data](../integration/input/metrics/metrics-auto-tagging/)
- [Full-Stack Distributed Tracing - Integrate OpenTelemetry and other tracing data](../integration/input/tracing/full-stack-distributed-tracing/)
