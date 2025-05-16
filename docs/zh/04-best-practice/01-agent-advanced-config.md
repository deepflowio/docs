---
title: Agent 高级配置
permalink: /best-practice/agent-advanced-config/
---

# 简介

DeepFlow 通过声明式 API 对所有 agent 进行统一管控，而 agent 的数据采集配置由 deepflow-server 根据 agent-group-config 内容统一下发至对应 agent-group 内的 agent。

agent-group 用于管理一组 agent 的配置，通过在 agent [配置文件](https://github.com/deepflowio/deepflow/blob/main/agent/config/deepflow-agent.yaml)（K8s ConfigMap 或 `/etc/deepflow-agent.yaml`）中指定 `vtap-group-id-request` 来声明归属的 agent-group（未指定时默认使用 [Default](../configuration/agent/) 配置），最终通过 agent-group-id 实现 agent、agent-group、agent-group-config 三者的关联。

## agent-group 常用操作

查看 agent-group 列表：

```bash
deepflow-ctl agent-group list
```

创建 agent-group：

```bash
deepflow-ctl agent-group create your-agent-group
```

获取创建的 agent-group-id:

```bash
deepflow-ctl agent-group list your-agent-group
```

## agent-group-config 常用操作

参考上述 agent-group-config [默认配置](../configuration/agent/)，摘取其中需要修改的部分输出至 `your-agent-group-config.yaml` 文件，例如：

```yaml
global:
  limits:
    max_millicpus: 1000
    max_memory: 768
```

### 创建 agent-group-config

```bash
deepflow-ctl agent-group-config create <agent-group-id> -f your-agent-group-config.yaml
```

### 获取 agent-group-config 列表

```bash
deepflow-ctl agent-group-config list
```

### 获取 agent-group-config 配置

```bash
deepflow-ctl agent-group-config list <agent-group-id> -o yaml
```

### 更新 agent-group-config 配置

```bash
deepflow-ctl agent-group-config update <agent-group-id> -f your-agent-group-config.yaml
```

## 各配置项说明

具体可参考[配置手册](../configuration/agent/)，各参数均有详细说明与使用示例
