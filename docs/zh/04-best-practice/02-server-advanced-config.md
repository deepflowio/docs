---
title: Server 高级配置
permalink: /best-practice/server-advanced-config/
---

# 简介


1111
DeepFlow Server 高级配置。

## 自定义部署参数

虽然你可以使用 helm `--set` 参数来定义部分配置，但我们建议将自定义的配置保存一个独立的 yaml 文件中。
例如 `values-custom.yaml` ：

```yaml
global:
  storageClass: "<your storageClass>"
  replicas: 1  ## replicas for deepflow-server and clickhouse
  image:
    ## ghcr Image repository address: ghcr.io/deepflowio/deepflow-ce
    ## Dockerhub Image repository address: deepflowce
    ## AliyunYun Image repository address: registry.cn-beijing.aliyuncs.com/deepflow-ce
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce ## change deepflow image registry to  aliyun
```

## 使用阿里云镜像仓库

```yaml
global:
  image:
      repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
grafana:
  image:
    repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
```

## 修改 Server 配置文件

参考 [server 配置文件](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml)修改 values 中的对应字段即可,
例如修改日志级别:

```yaml
configmap:
  server.yaml:
    log-level: debug
```

后续更新可以使用 `-f values-custom.yaml` 参数使用自定义配置：

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## 服务配置

- `global.hostNetwork`: 是否使用 Host Network，默认为 `false`，CNI 网络不可用或者采集流量非常大的环境可以使用 Host Network。
- `global.dnsPolicy`: DeepFlow 组件 DNS 策略，默认为 `dnsPolicy`，使用 Host Network 时需要改为 `ClusterFirstWithHostNet`。
- `global.clusterDomain`: 集群域名，默认为 `cluster.local`，如果你的环境有自定义配置，需要修改此处，如果未修改会影响多 server 环境下的 server 之间互相访问。
- `global.allInOneLocalStorage`: All-in-One 部署并使用本地 HostPath 存储时打开，默认值为 `false`，数据默认存储在 `/opt/deepflow-mysql`、`/opt/deepflow-clickhouse`。

## 服务端口

- `global.nodePort.deepflowServerIngester`
  - deepflow-server ingrester 模块需要暴露的 NodePort 端口号，默认为30033，用于 agent 向 server 传输数据。
  - 如有冲突，修改此处后需要修改 `agent-group-config` 的 `analyzer_port`。
- `global.nodePort.deepflowServerGrpc`
  - deepflow-server controller 模块需要暴露的 NodePort 端口号，默认为30035，用于 agent 向 server 请求策略。
  - 如有冲突，修改此处后需要修改 `agent-group-config` 的 `proxy_controller_port`。
- `global.nodePort.deepflowServerhealthCheck`
  - deepflow-server controller 模块暴露给 deepflow-ctl 的 HTTP NodePort 端口号，默认为30417。
  - 如有冲突，修改此处后使用 `deepflow-ctl` 命令需要指定 `--api-port` 参数。

## 依赖服务

- `global.image.repository`: DeepFlow 组件镜像仓库地址，默认为 DockerHub: `deepflowce`，国内用户可以切换为阿里云:  `registry.cn-beijing.aliyuncs.com/deepflow-ce`。
- `global.image.pullPolicy`: DeepFlow 组件镜像拉取策略，默认为 `Always` 以获取重启 Pod 更新 DeepFlow 的能力。
- `global.ntpServer`: DeepFlow 的时间同步服务器，默认值为 `ntp.aliyun.com` 。
- `global.storageClass`: DeepFlow 部署使用的 `storageClass`，默认为空即使用 default storageClass。

