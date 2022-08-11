---
title: 高级配置
permalink: /install/advanced-config
---

# 简介

DeepFlow Server 和 DeepFlow Agent 的高级配置。

# DeepFlow Server 高级配置

## 保存自定义配置

虽然你可以使用 helm `--set` 参数来定义部分配置，但我们建议将自定义的配置保存一个独立的 yaml 文件中。
例如 `values-custom.yaml` ：
```yaml
global:
  storageClass: "<your storageClass>"
  replicas: 1  ## replicas for deepflow-server and clickhouse
  image:
    ## ghcr Image repository address: ghcr.io/deepflowys/deepflow-ce
    ## Dockerhub Image repository address: deepflowce
    ## AliyunYun Image repository address: registry.cn-beijing.aliyuncs.com/deepflow-ce
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce ## change deepflow image registry to  aliyun
```

后续更新可以使用 `-f values-custom.yaml` 参数使用自定义配置：

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## 常用自定义参数

`global.image.repository`: DeepFlow 组件镜像仓库地址, 默认为 DockerHub: `deepflowce`, 国内用户可以切换为阿里云:  `registry.cn-beijing.aliyuncs.com/deepflow-ce`。

`global.image.pullPolicy`: DeepFlow 组件镜像拉取策略, 默认为 `Always` 以获取重启 Pod 更新 DeepFlow 的能力。

`global.hostNetwork`: 是否使用 Host Network, 默认为 `false`, CNI 网络不可用或者采集流量非常大的环境可以使用 Host Network。

`global.dnsPolicy`: DeepFlow 组件 DNS 策略, 默认为 `dnsPolicy`, 使用 Host Network 时需要改为 `ClusterFirstWithHostNet` 。

`global.replicas`: deepflow-server 和 clickhouse 的副本数量，6.1.1版本为 deepflow-server 向相同副本号的 clickhouse 写入数据，需要保证 deepflow-server 和 clickhouse 有相同的副本数量。

`global.nodePort`: DeepFlow 相关组件需要暴露的 NodePort 端口号。

`global.nodePort.clickhouse`: Clickhouse 需要暴露的 NodePort 端口号, 默认为30900，如有冲突，可以直接修改。

`global.nodePort.deepflowServerIngester`: deepflow-server ingrester 模块需要暴露的 NodePort 端口号，默认为30033，如有冲突，修改此处后需要修改 `agent-group-config` 的 `analyzer_port`。

`global.nodePort.deepflowServerGrpc`: deepflow-server controller 模块需要暴露的 NodePort 端口号，默认为30035，如有冲突，修改此处后需要修改 `agent-group-config` 的 `proxy_controller_port`。

`global.nodePort.deepflowServerhealthCheck`: deepflow-server controller 模块需要暴露的 HTTP NodePort 端口号，默认为30033，如有冲突，修改此处后使用 `deepflow-ctl` 命令需要指定 `--api-port` 参数。

`global.ntpServer`: DeepFlow 的时间同步服务器，默认值为 `ntp.aliyun.com` 。

`global.allInOneLocalStorage`: All In One 部署并使用本地 HostPath 存储时打开, 默认值为 `false`, 数据默认存储在 `/opt/deepflow-mysql`、`/opt/deepflow-clickhouse`。

`global.storageClass`: DeepFlow 部署使用的 `storageClass`, 默认为空即使用 default storageClass。

`global.clusterDomain`: 集群域名, 默认为 `cluster.local`, 如果你的环境有自定义配置，需要修改此处, 如果未修改会影响多server环境下的server之间互相访问。

# DeepFlow Agent 高级配置

deepflow-agent 的大部分配置通过 deepflow-server 下发，在 deepflow 中，agent-group 为管理一组 deepflow agent 配置的组，deepflow-agent 可以在启动时通过指定 `vtap-group-id-request`  agent-group-config 和 agent-group 一对一通过 agent-group ID 关联。

## deepflow-ctl agent-group 操作

查看 agent-group 列表：
```bash
deepflow-ctl agent-group list
```

创建一个 agent-group：
```bash
deepflow-ctl agent-group create example
```

获取刚刚创建的 agent-group ID: 

```bash
deepflow-ctl agent-group list example
```

创建和上面 agent-group 关联的 agent-group-config :

修改 deepflow-ctl 创建 agent-group-config 的配置文件 `example-agent-group-config.yaml` ：

```yaml
vtap_group_id: <Your agnet-group ID>
```

创建 agent-group-config :

```bash
deepflow-ctl agent-group-config create -f example-agent-group-config.yaml
```

获取 agent-group-config 列表：

```bash
deepflow-ctl agent-group-config list
```

获取 agent-group-config 配置：

```bash
deepflow-ctl agent-group-config list <Your agnet-group ID> -o yaml
```

更新 agent-group-config 配置：

```bash
deepflow-ctl agent-group-config update <Your agnet-group ID> -f example-agent-group-config.yaml
```

## 常用配置项

`max_memory`: agent 最大内存限制，默认值为`768`，单位为 MB。

`thread_threshold`: agent 最大线程数量，默认值为`500`。

`tap_interface_regex`:  agent 采集网卡正则配置， 默认值为 `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`, agent 只需要采集容器网卡和物理网卡即可。

`platform_enabled: 0`:  agent 上报资源时使用， 用于 `agent-sync` 的domain，一个 DeepFlow 平台只能有一个`agent-sync` 的 domain。

### 获取所有配置项及其默认配置：

```bash
deepflow-ctl agent-group-config example
```