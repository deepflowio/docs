---
title: 在云服务器中安装 Agent
permalink: /ee-install/saas/cloud-host
---

# 简介

如果您没有使用 K8s，本章节将详细介绍如何在您的云服务器中部署 DeepFlow Agent。

DeepFlow Agent 在云服务器中开始运行后，将自动零侵扰采集云服务器中应用的观测数据（AutoMetrics、AutoTracing、AutoProfiling）， 并自动为所有观测数据注入`云资源`标签（AutoTagging）。

# 部署拓扑

![部署拓扑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240709668ce0a950a1c.jpeg)
![部署拓扑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407156694c79250a2a.jpeg)

# 部署前的检查

录入云平台信息，并且云服务器资源被 DeepFlow 通过云平台 API 接口成功学习，是在云服务器中部署 DeepFlow Agent 的前提条件：
- 如果未录入云平台，请首先录入云平台并配置正确的云平台 API 对接信息，参考[在 DeepFlow 中录入云平台](./cloud/)章节说明。
- 如果已录入云平台，请在 DeepFlow 的 Web 页面中检查`资源`-`计算资源`-`云服务器`中通过 IP 搜索，确认云服务器是否已成功学习，操作步骤参考下图：

![检查云服务器列表](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240703668504773b7c0.png)

# 部署 Agent

## 获取 teamId

`teamId`即`团队 ID`，用于识别 DeepFlow Agent 所属的组织，操作步骤参考下图：

![获取 teamId（团队 ID）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240703668504714e57f.png)

## 获取 agentGroupID

`agentGroupId`即`采集器组 ID`，用于识别 DeepFlow Agent 所属的采集器组，操作步骤参考下图：

![获取 agentGroupId（采集器组 ID）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024070366850473b0257.png)

::: tip
创建采集器组的目的是为了配置不同的运行策略，以便于对 DeepFlow Agent 进行运行策略的分组管理。
:::

## 获取安装包

Docker 环境推荐使用 Docker Compose 模式部署，无需手动获取安装包。

非 Docker 环境，请联系云杉技术支持人员获取安装包。

## 安装 Agent 软件包

::: code-tabs#shell

@tab rpm

```bash
unzip deepflow-agent-rpm.zip  # please contact us
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
unzip deepflow-agent-deb.zip  # please contact us
dpkg -i x86_64/deepflow-agent-1.0*.systemd.deb
```

@tab docker compose

```bash
touch /etc/deepflow-agent.yaml

cat << EOF > deepflow-agent-docker-compose.yaml
version: '3.2'
services:
  deepflow-agent:
    image: hub.deepflow.yunshan.net/public/deepflow-agent:v6.5
    container_name: deepflow-agent
    restart: always
    #privileged: true  ## Docker version below 20.10.10 requires the opening of the privileged mode, See https://github.com/moby/moby/pull/42836
    cap_add:
      - SYS_ADMIN
      - SYS_RESOURCE
      - SYS_PTRACE
      - NET_ADMIN
      - NET_RAW
      - IPC_LOCK
      - SYSLOG
    volumes:
      - /etc/deepflow-agent.yaml:/etc/deepflow-agent/deepflow-agent.yaml:ro
      - /sys/kernel/debug:/sys/kernel/debug:ro
      - /var/run/docker.sock:/var/run/docker.sock
    network_mode: "host"
    pid: "host"
EOF

docker compose -f deepflow-agent-docker-compose.yaml up -d
```

:::

## 修改 Agent 配置文件

修改 DeepFlow Agent 的配置文件（默认存放位置：`/etc/deepflow-agent.yaml` ）

```yaml
controller-ips:
  - agent.cloud.deepflow.yunshan.net
vtap-group-id-request: 'g-xxxxxxxxxx' # FIXME: agent-group ID
team-id: 't-xxxxxxxxxx' # FIXME: Team ID
```
关键字段的取值说明如下：

| 字段 | 字段用途 | 取值 | 例外说明 |
|-------|-----|--------|--------|
| `controller-ips` |  DeepFlow Agent 所要连接的 DeepFlow Server 地址 |  `agent.cloud.deepflow.yunshan.net` |  该地址错误时，DeepFlow Agent 将**无法注册** |
| `teamId` |  即`团队 ID` ， DeepFlow Server 根据该字段确定 DeepFlow Agent 所属的组织 | DeepFlow 页面获取 | 该 ID 值错误时，DeepFlow Agent 将**无法注册** |
| `vtap-group-id-request` |  即采集器组 ID，DeepFlow Server 根据该字段下发运行策略 | DeepFlow 页面获取 |  该 ID 值无效时，DeepFlow Server 会向 DeepFlow Agent **下发 default 组的运行策略** |

## 启动 Agent 服务

```bash
systemctl enable deepflow-agent
systemctl restart deepflow-agent
```
