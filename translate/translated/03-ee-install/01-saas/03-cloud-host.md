---
title: Installing Agent on Cloud Servers
permalink: /ee-install/saas/cloud-host
---

> This document was translated by ChatGPT

# Introduction

If you are not using K8s, this chapter will detail how to deploy the DeepFlow Agent on your cloud servers.

Once the DeepFlow Agent starts running on the cloud server, it will automatically and non-intrusively collect observability data (AutoMetrics, AutoTracing, AutoProfiling) from the applications on the cloud server and automatically inject `cloud resource` tags into all observability data (AutoTagging).

# Deployment Topology

![Deployment Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407156694c79250a2a.jpeg)

# Pre-deployment Checks

Entering cloud platform information and successfully learning cloud server resources through the cloud platform API interface are prerequisites for deploying the DeepFlow Agent on cloud servers:

- If the cloud platform has not been entered, please first enter the cloud platform and configure the correct cloud platform API connection information. Refer to the chapter [Entering Cloud Platform in DeepFlow](./cloud/).
- If the cloud platform has been entered, please check on the DeepFlow web page under `Resources` - `Compute Resources` - `Cloud Servers` by searching via IP to confirm whether the cloud server has been successfully learned. Refer to the steps in the image below:

![Check Cloud Server List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a709808f6.png)

# Deploying the Agent

## Obtain teamId

`teamId` is the `Team ID`, used to identify the organization to which the DeepFlow Agent belongs. Refer to the steps in the image below:

![Obtain teamId (Team ID)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a6fd05bc7.png)

## Obtain agentGroupID

`agentGroupId` is the `Collector Group ID`, used to identify the collector group to which the DeepFlow Agent belongs. Refer to the steps in the image below:

![Obtain agentGroupId (Collector Group ID)](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a7017f7b0.png)

::: tip
The purpose of creating a collector group is to configure different operating policies to facilitate the grouped management of DeepFlow Agent operating policies.
:::

## Obtain Installation Package

For Docker environments, it is recommended to deploy using Docker Compose mode, which does not require manually obtaining the installation package.

For non-Docker environments, please contact Yunshan technical support to obtain the installation package.

## Install Agent Package

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

## Modify Agent Configuration File

Modify the DeepFlow Agent configuration file (default location: `/etc/deepflow-agent.yaml`)

```yaml
controller-ips:
  - agent.cloud.deepflow.yunshan.net
vtap-group-id-request: 'g-xxxxxxxxxx' # FIXME: agent-group ID
team-id: 't-xxxxxxxxxx' # FIXME: Team ID
```

Explanation of key field values:

| Field                   | Purpose                                                               | Value                              | Exception Description                                                             |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| `controller-ips`        | Address of the DeepFlow Server that the DeepFlow Agent will connect to | `agent.cloud.deepflow.yunshan.net` | If this address is incorrect, the DeepFlow Agent will **fail to register**        |
| `teamId`                | The `Team ID`, used by the DeepFlow Server to determine the organization to which the DeepFlow Agent belongs | Obtained from DeepFlow page        | If this ID is incorrect, the DeepFlow Agent will **fail to register**             |
| `vtap-group-id-request` | The Collector Group ID, used by the DeepFlow Server to issue operating policies | Obtained from DeepFlow page        | If this ID is invalid, the DeepFlow Server will issue the **default group policy** to the DeepFlow Agent |

## Start Agent Service

```bash
systemctl enable deepflow-agent
systemctl restart deepflow-agent
```