---
title: Agent 高级配置
permalink: /install/advanced-config/agent-advanced-config/
---

# 简介

DeepFlow Agent 高级配置。

DeepFlow 使用声明式 API 对所有 deepflow-agent 进行控制，几乎所有的 deepflow-agent 配置均通过 deepflow-server 下发。在 DeepFlow 中，agent-group 为管理一组 deepflow-agent 配置的组。我们可以在 deepflow-agent 本地配置文件（K8s ConfigMap、Host 上的 deepflow-agent.yaml）中指定 `vtap-group-id-request` 来声明希望加入的组，也可直接在 deepflow-server 上配置每个 deepflow-agent 的所属组（且后者优先级更高）。agent-group-config 和 agent-group 一一对应，通过 agent-group ID 关联。

## agent-group 操作

查看 agent-group 列表：
```bash
deepflow-ctl agent-group list
```

创建一个 agent-group：
```bash
deepflow-ctl agent-group create your-agent-group
```

获取刚刚创建的 agent-group ID:
```bash
deepflow-ctl agent-group list your-agent-group
```

### 获取 agent 默认配置

```bash
deepflow-ctl agent-group-config example
```

## agent-group-config 操作

参考上述 agent 默认配置，摘取其中你想修改的部分，创建一个 `your-agent-group-config.yaml` 文件并填写 agent 配置参数，注意必须包含 `vtap_group_id`：
```yaml
vtap_group_id: <Your-agnet-group-ID>
# write configurations here
```

创建 agent-group-config:
```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

获取 agent-group-config 列表：
```bash
deepflow-ctl agent-group-config list
```

获取 agent-group-config 配置：
```bash
deepflow-ctl agent-group-config list <Your-agnet-group-ID> -o yaml
```

更新 agent-group-config 配置：
```bash
deepflow-ctl agent-group-config update <Your-agnet-group-ID> -f your-agent-group-config.yaml
```

## 常用配置项

- `max_memory`: agent 最大内存限制，默认值为 `768`，单位为 MB。
- `thread_threshold`: agent 最大线程数量，默认值为 `500`。
- `tap_interface_regex`: agent 采集网卡正则配置，默认值为 `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`，agent 只需要采集 Pod 网卡和 Node/Host 物理网卡即可。
- `platform_enabled`: agent 上报资源时使用， 用于 `agent-sync` 的 domain，一个 DeepFlow 平台只能有一个`agent-sync` 的 domain。

## 常见场景的配置

### MACVlan

K8s 使用 macvlan CNI 时，在 rootns 下只能看到所有 POD 共用的一个虚拟网卡，此时需要对 deepflow-agent 进行额外的配置：

TODO
