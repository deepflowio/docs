---
title: 在传统服务器中安装 Agent
permalink: /ee-install/on-prem/legacy-host
---

# 简介

DeepFlow 支持监控传统服务器。

# 部署拓扑

```mermaid
flowchart LR

subgraph K8s-Cluster
  DeepFlowServer["deepflow-server (deployment)"]
end

subgraph Legacy-Host-1
  DeepFlowAgent1[deepflow-agent]
  DeepFlowAgent1 --> DeepFlowServer
end

subgraph Legacy-Host-2
  DeepFlowAgent2[deepflow-agent]
  DeepFlowAgent2 --> DeepFlowServer
end
```

## 获取采集器安装包和采集器组的 Agent Group ID

传统服务器部署 DeepFlow Agent 时需要向云杉网络的同学获取传统服务器的安装包和 Agent Group ID

# 部署 DeepFlow Agent

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
    image: hub.deepflow.yunshan.net/public/deepflow-agent:v6.4
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

修改 deepflow-agent 的配置文件 `/etc/deepflow-agent.yaml` ：

```yaml
controller-ips:
  - 10.1.2.3 # FIXME: DeepFlow Server Node IPs
vtap-group-id-request: 'g-fffffff' # FIXME: agent-group ID
```

启动 deepflow-agent ：

```bash
systemctl enable deepflow-agent
systemctl restart deepflow-agent
```
