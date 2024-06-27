---
title: 在云服务器中安装 Agent
permalink: /ee-install/saas/cloud-host
---

# 简介

DeepFlow 支持监控云服务器，并通过调用云厂商 API 获取云资源信息，自动注入到所有观测数据中（AutoTagging）。

- **部署拓扑**

```mermaid
flowchart LR

subgraph DeepFlow-Cloud
  DeepFlowServer["deepflow-server"]
end


subgraph VPC-1
  subgraph Cloud-Host-1
    DeepFlowAgent1[deepflow-agent]
    DeepFlowAgent1 -->|"tcp/udp 30033+30035"| DeepFlowServer
  end
end

DeepFlowServer -->|"get resource & label"| CloudAPI[cloud api service]
```

# 准备工作

## 获取采集器安装包

公有云服务器部署 DeepFlow Agent 时需要向云杉网络的同学获取传统服务器的安装包。

## 创建公有云 Domain

DeepFlow 目前支持如下公有云的资源信息同步（标记为 `TBD` 的正在整理代码中）：
| 云服务商（英文） | 云服务商（中文） | DeepFlow 中使用的类型标识 |
| ---------------- | ---------------- | ------------------------ |
| AWS | AWS | aws |
| Aliyun | 阿里云 | aliyun |
| Baidu Cloud | 百度云 | baidu_bce |
| Huawei Cloud | 华为云 | huawei |
| Microsoft Azure | 微软云 | `TBD` |
| QingCloud | 青云 | qingcloud |
| Tencent Cloud | 腾讯云 | tencent |

## 获取部署 DeepFlow Agent 必需的信息

部署 DeepFlow Agent 前需在 DeepFlow Cloud 中获取两个 ID，并配置到 DeepFlow Agent 的配置文件中：

- **获取 `团队 ID / team-id`**
  
  操作步骤参考下图：

   ![获取 team-id](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240613666aee7de4dd5.jpeg?align=center)

- **新建采集器组并获取 `agent-group-id`**

  操作步骤参考下图：

   ![获取 agent-group-id](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240613666aeb1bb3cb9.jpg?align=center)

> 注：创建采集器组的目的是为了配置不同的运行策略，以便于对 DeepFlow Agent 进行运行策略的分组管理。当 DeepFlow Agent 配置的`agent-group-id`在平台中无法找到时，平台会下发 default 组的运行策略。

# 部署 DeepFlow Agent

- **执行安装命令**

::: code-tabs#shell

@tab rpm

```bash
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
unzip deepflow-agent-deb.zip
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

- **修改 deepflow-agent 的配置文件 `/etc/deepflow-agent.yaml`**

```yaml
controller-ips:
  - agent.cloud.deepflow.yunshan.net
vtap-group-id-request: 'g-xxxxxxxxxx' # FIXME: agent-group-id
team-id: 't-xxxxxxxxxx' # FIXME: team id
```

- **启动 deepflow-agent**

```bash
systemctl enable deepflow-agent
systemctl restart deepflow-agent
```
