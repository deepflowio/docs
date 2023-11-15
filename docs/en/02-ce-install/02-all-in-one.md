> This document was translated by GPT-4

---

title: All-in-One Quick Deployment
permalink: /ce-install/all-in-one

---

# Introduction

Although the deepflow-agent can run in various environments, the deepflow-server must run on K8s. In this chapter, we start with an All-in-One K8s cluster and introduce how to deploy a DeepFlow experience environment.

# Preparations

## Resource Requirements

- It is recommended that the minimum specifications of the virtual machine for deployment are 4C8G

## Deploying All-in-One K8s

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

## Install Helm

DeepFlow is deployed using [Helm](https://helm.sh/), the installation method is as follows:

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

You can also use sealos to install helm:

```bash
sealos run labring/helm:v3.8.2
```

# Deploying All-in-One DeepFlow

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
grafana:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
EOF
helm install deepflow -n deepflow deepflow/deepflow --create-namespace \
  -f values-custom.yaml
```

:::

Note:

- We suggest to save the content of helm `--set` parameter in a separate yaml file, refer to [Advanced Configuration](../best-practice/server-advanced-config/) section.

# Downloading deepflow-ctl

deepflow-ctl is a command line tool for managing DeepFlow. We recommend downloading it to the K8s Node where the deepflow-server is located for subsequent use.

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Accessing the Grafana Page

The output of deploying DeepFlow with helm gives commands to get the URL and password to access Grafana, output example:

```bash
NODE_PORT=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-grafana)
NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo -e "Grafana URL: http://$NODE_IP:$NODE_PORT  \nGrafana auth: admin:deepflow"
```

Example of the output after executing the above command:

```text
Grafana URL: http://10.1.2.3:31999
Grafana auth: admin:deepflow
```

# Next Steps

- [Universal Service Map - Experience DeepFlow's AutoMetrics Capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing Capability](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Silos - Understand DeepFlow's AutoTagging and SmartEncoding Capability](../features/auto-tagging/eliminate-data-silos/)
- [Saying goodbye to high-base worries - Integrating Prometheus and other metric data](../integration/input/metrics/metrics-auto-tagging/)
- [Full Stack Distributed Tracing - Integrating OpenTelemetry and other tracing data](../integration/input/tracing/full-stack-distributed-tracing/)
