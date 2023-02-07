---
title: All-in-One Rapid Deployment
permalink: /install/all-in-one
---

# Introduction

Although deepflow-agent can run in various environments, deepflow-server must run in K8s environment. In this chapter, we start from an All-in-One K8s cluster and introduce how to deploy a DeepFlow experience environment.


# Preparation

## Resource Requirements

- The minimum specification of the virtual machine recommended for deployment is 4C8G.

## Deploy The All-in-One K8s

Use [sealos](https://github.com/labring/sealos)  to quickly install a K8s cluster：

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

## Install Helm

DeepFlow is deployed using [Helm](https://helm.sh/) and can be installed by：
```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

Similarly, you can install the helm using sealos：
```bash
sealos run labring/helm:v3.8.2
```

# Deploy All-in-One DeepFlow

Install All-in-One DeepFlow with Helm：

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

notice：
- We recommend that the contents of helm's '--set' parameters be saved in a separate yaml file, as described in the section Advanced Configuration。

# Download deepflow-ctl

Deepflow-ctl is a command line tool for managing deepflow. You are advised to download it to the K8s Node where the deepflow-server resides for future use：
```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Visualization in Grafana

The output when running helm to deploy DeepFlow prompts the command to get the URL and password to access Grafana, and prints an example：
```bash
NODE_PORT=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-grafana)
NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo -e "Grafana URL: http://$NODE_IP:$NODE_PORT  \nGrafana auth: admin:deepflow"
```

An example is displayed after the preceding command is executed：
```text
Grafana URL: http://10.1.2.3:31999
Grafana auth: admin:deepflow
```

# The Next Step

- Microservice Panorama - Experience DeepFlow's AutoMetrics capability based on BPF
- Automatic Distributed Tracing - Experience DeepFlow's AutoTracing capability based on eBPF
- Eliminating Data Silos - Learn about AutoTagging and SmartEncoding capabilities for DeepFlow
- How DeepFlow handle high-cardinality - Integrate Promethes and other metrics data
- Distributed tracking without blind spots - Integrate tracing data such as OTel
