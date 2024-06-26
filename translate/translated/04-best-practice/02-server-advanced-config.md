---
title: Server Advanced Configuration
permalink: /best-practice/server-advanced-config/
---

> This document was translated by ChatGPT

# Introduction

DeepFlow Server advanced configuration.

## Custom Deployment Parameters

Although you can use the helm `--set` parameter to define some configurations, we recommend saving custom configurations in a separate yaml file.
For example, `values-custom.yaml`:

```yaml
global:
  storageClass: '<your storageClass>'
  replicas: 1 ## replicas for deepflow-server and clickhouse
  image:
    ## ghcr Image repository address: ghcr.io/deepflowio/deepflow-ce
    ## Dockerhub Image repository address: deepflowce
    ## AliyunYun Image repository address: registry.cn-beijing.aliyuncs.com/deepflow-ce
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce ## change deepflow image registry to  aliyun
```

## Using Alibaba Cloud Image Repository

```yaml
global:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
grafana:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
```

## Modifying Server Configuration File

Refer to the [server configuration file](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml) to modify the corresponding fields in values,
for example, to change the log level:

```yaml
configmap:
  server.yaml:
    log-level: debug
```

For subsequent updates, you can use the `-f values-custom.yaml` parameter to apply custom configurations:

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## Service Configuration

- `global.hostNetwork`: Whether to use Host Network, default is `false`. Use Host Network in environments where CNI network is unavailable or traffic collection is very high.
- `global.dnsPolicy`: DNS policy for DeepFlow components, default is `dnsPolicy`. When using Host Network, change to `ClusterFirstWithHostNet`.
- `global.clusterDomain`: Cluster domain, default is `cluster.local`. If your environment has custom configurations, modify this. If not modified, it will affect inter-server communication in multi-server environments.
- `global.allInOneLocalStorage`: Enable when deploying All-in-One and using local HostPath storage, default is `false`. Data is stored by default in `/opt/deepflow-mysql`, `/opt/deepflow-clickhouse`.

## Service Ports

- `global.nodePort.deepflowServerIngester`
  - NodePort port number that the deepflow-server ingrester module needs to expose, default is 30033, used for agents to transmit data to the server.
  - If there is a conflict, modify this and also update the `analyzer_port` in `agent-group-config`.
- `global.nodePort.deepflowServerGrpc`
  - NodePort port number that the deepflow-server controller module needs to expose, default is 30035, used for agents to request policies from the server.
  - If there is a conflict, modify this and also update the `proxy_controller_port` in `agent-group-config`.
- `global.nodePort.deepflowServerhealthCheck`
  - HTTP NodePort port number that the deepflow-server controller module exposes to deepflow-ctl, default is 30417.
  - If there is a conflict, modify this and specify the `--api-port` parameter when using the `deepflow-ctl` command.

## Dependent Services

- `global.image.repository`: Image repository address for DeepFlow components, default is DockerHub: `deepflowce`. Domestic users can switch to Alibaba Cloud: `registry.cn-beijing.aliyuncs.com/deepflow-ce`.
- `global.image.pullPolicy`: Image pull policy for DeepFlow components, default is `Always` to enable updating DeepFlow by restarting Pods.
- `global.ntpServer`: Time synchronization server for DeepFlow, default is `ntp.aliyun.com`.
- `global.storageClass`: `storageClass` used for DeepFlow deployment, default is empty which means using the default storageClass.