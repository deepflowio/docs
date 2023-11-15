> This document was translated by GPT-4

---

title: Advanced Server Configuration
permalink: /best-practice/server-advanced-config/

---

# Introduction

Advanced configuration for DeepFlow Server.

## Custom Deployment Parameters

Although you can define some configurations using the helm `--set` parameter, we recommend saving your custom configurations in a separate yaml file.
For example in `values-custom.yaml` ：

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

## Use Aliyun Image Repository

```yaml
global:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
grafana:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
```

## Modify Server Configuration File

Refer to this [server config file](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml) to modify the corresponding fields in values,
For example, to change the log level:

```yaml
configmap:
  server.yaml:
    log-level: debug
```

Subsequent updates can use the `-f values-custom.yaml` parameter to apply your custom configurations:

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## Service Configuration

- `global.hostNetwork`: Whether to use Host Network, defaulted to `false`. Use Host Network when CNI network is unavailable, or the traffic collection volume is large.
- `global.dnsPolicy`: DNS policy for DeepFlow components, defaulted to `dnsPolicy`. When using Host Network, change to `ClusterFirstWithHostNet`.
- `global.clusterDomain`: Cluster domain name, defaulted to `cluster.local`. If your environment has custom configurations, this needs to be modified. If not modified, it will affect the communication between servers in a multi-server environment.
- `global.allInOneLocalStorage`: Enable this when it is an all-in-one deployment and local HostPath storage is used, with the default value being `false`. Data is stored by default in `/opt/deepflow-mysql` and `/opt/deepflow-clickhouse`.

## Service Ports

- `global.nodePort.deepflowServerIngester`
  - The NodePort port number that needs to be exposed by the deepflow-server ingrester module, default is 30033, for agents to transmit data to the server.
  - If there is a conflict, after modifying here, you need to modify `analyzer_port` in `agent-group-config`.
- `global.nodePort.deepflowServerGrpc`
  - The NodePort port number that needs to be exposed by the deepflow-server controller module, default is 30035, for agents to request strategies from the server.
  - If there is a conflict, after modifying here, you need to modify `proxy_controller_port` in `agent-group-config`.
- `global.nodePort.deepflowServerhealthCheck`
  - The HTTP NodePort port number exposed by the deepflow-server controller module to deepflow-ctl, the default is 30417.
  - If there is a conflict, after modifying here you need to specify the `--api-port` parameter when using the `deepflow-ctl` command.

## Dependent Services

- `global.image.repository`: Image repository address for DeepFlow components, default is DockerHub: `deepflowce`. Domestic users can switch to Aliyun: `registry.cn-beijing.aliyuncs.com/deepflow-ce`.
- `global.image.pullPolicy`: Image pull policy for DeepFlow components, default is `Always` in order to get the ability to update DeepFlow by restarting Pods.
- `global.ntpServer`: The time synchronization server for DeepFlow, the default value is `ntp.aliyun.com`.
- `global.storageClass`: The `storageClass` used by DeepFlow deployment, the default is empty, which means use the default storageClass.
