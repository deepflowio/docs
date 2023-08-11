---
title: Agent 高级配置
permalink: /install/advanced-config/agent-advanced-config/
---

# 简介

DeepFlow Agent 高级配置。

DeepFlow 使用声明式 API 对所有 deepflow-agent 进行控制，几乎所有的 deepflow-agent 配置均通过 deepflow-server 下发。在 DeepFlow 中，agent-group 为管理一组 deepflow-agent 配置的组。我们可以在 deepflow-agent 本地配置文件（K8s ConfigMap、Host 上的 deepflow-agent.yaml）中指定 `vtap-group-id-request` 来声明希望加入的组，也可直接在 deepflow-server 上配置每个 deepflow-agent 的所属组（且后者优先级更高）。agent-group-config 和 agent-group 一一对应，通过 agent-group ID 关联。

## agent-group 常用操作

查看 agent-group 列表：
```bash
deepflow-ctl agent-group list
```

创建 agent-group：
```bash
deepflow-ctl agent-group create your-agent-group
```

获取刚刚创建的 agent-group ID:
```bash
deepflow-ctl agent-group list your-agent-group
```



## agent-group-config 常用操作

参考上述 agent 默认配置，摘取其中你想修改的部分，创建一个 `your-agent-group-config.yaml` 文件并填写 agent 配置参数，注意必须包含 `vtap_group_id`：
```yaml
vtap_group_id: <Your-agnet-group-ID>
# write configurations here
```
### 创建 agent-group-config

```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

### 获取 agent-group-config 列表

```bash
deepflow-ctl agent-group-config list
```

### 获取 agent-group-config 配置

```bash
deepflow-ctl agent-group-config list <Your-agnet-group-ID> -o yaml
```

### 获取 agent-group-config 所有配置及其默认值

```bash
deepflow-ctl agent-group-config example
```

### 更新 agent-group-config 配置

```bash
deepflow-ctl agent-group-config update -f your-agent-group-config.yaml
```

## 常用配置项

- `max_memory`: agent 最大内存限制，默认值为 `768`，单位为 MB。
- `thread_threshold`: agent 最大线程数量，默认值为 `500`。
- `tap_interface_regex`: agent 采集网卡正则配置，默认值为 `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`，agent 只需要采集 Pod 网卡和 Node/Host 物理网卡即可。
- `platform_enabled`: agent 上报资源时使用， 用于 `agent-sync` 的 domain，一个 DeepFlow 平台只能有一个`agent-sync` 的 domain。

## 常见场景的配置

### MACVlan

K8s 使用 macvlan CNI 时，在 rootns 下只能看到所有 POD 共用的一个虚拟网卡，此时需要对deepflow-agent 进行额外的配置：

1. 创建 agent-group 和 agent-group-config：
    ```bash
    deepflow-ctl agent-group create macvlan
    deepflow-ctl agent-group-config create macvlan
    ```

2. 获取 macvlan agent-group ID：
    ```bash
    deepflow-ctl agent-group list  | grep macvlan
    ```

3. 新建 agent-group-config 配置文件 `macvlan-agent-group-config.yaml`:
    ```yaml
    vtap_group_id: g-xxxxxx
    ## Traffic Tap Mode
    ## Default: 0, means local.
    ## Options: 0, 1 (virtual mirror), 2 (physical mirror, aka. analyzer mode)
    ## Note: Mirror mode is used when deepflow-agent cannot directly capture the
    ##   traffic from the source. For example:
    ##   - in the K8s macvlan environment, capture the Pod traffic through the Node NIC
    ##   - in the Hyper-V environment, capture the VM traffic through the Hypervisor NIC
    ##   - in the ESXi environment, capture traffic through VDS/VSS local SPAN
    ##   - in the DPDK environment, capture traffic through DPDK ring buffer
    ##   Use Analyzer mode when deepflow-agent captures traffic through physical switch
    ##   mirroring.
    tap_mode: 1
    static_config:
      ################
      ## Dispatcher ##
      ################
      ## TAP NICs when tap_mode != 0
      ## Note: The list of capture NICs when tap_mode is not equal to 0, in which
      ##   case tap_interface_regex is invalid.
      src-interfaces:
      - eth0 ## The mother interface of macvlan, such as eth0.
    ```

4. 创建 agent-group-config：
    ```bash
    deepflow-ctl agent-group-config create -f macvlan-agent-group-config.yaml
    ```

5. 修改 deepflow-agent 的 agent-group：
    ```bash
    kubectl edit cm -n deepflow deepflow-agent
    ```
    添加配置：
    ```yaml  
    vtap-group-id-request: g-xxxxx
    ```
    停止 deepflow-agent：
    ```bash
    kubectl -n deepflow  patch daemonset deepflow-agent  -p '{"spec": {"template": {"spec": {"nodeSelector": {"non-existing": "true"}}}}}'
    ```
    通过deepflow-ctl 删除 macvlan 的 agent：
    ```bash
    deepflow-ctl agent delete <agent name>
    ```
    启动 deepflow-agent：
    ```bash
    kubectl -n deepflow  patch daemonset deepflow-agent --type json -p='[{"op": "remove", "path": "/spec/template/spec/nodeSelector/non-existing"}]'
    ```
    查看 deepflow agent list， 确保 agent 加入了 macvlan group：
    ```bash
    deepflow-ctl agent list
    ```

# 以进程形态部署 DeepFlow Agent

当无法直接在 Kubernetes 集群中以 Daemonset 形式部署 DeepFlow Agent 时，但可在宿主机上直接部署二进制时，可使用该方法实现流量采集。

- 以 deployment 形态部署一个 deepflow-agent
  - 通过设置环境变量 ONLY_WATCH_K8S_RESOURCE，该 agent 仅实现对 K8s 资源的 list-watch 及上送控制器的功能
  - 这个 agent 的其他所有功能均会自动关闭
  - agent 请求 server 时告知自己在 watch_k8s，server 会将此信息更新到 MySQL 数据库中
  - 用做 Watcher 的采集器将不会出现在采集器列表中

- 在这个 K8s 集群中，以 Linux 进程的形态在所有 K8s Node 上运行一个 deepflow-agent，执行正常的 agent 功能
  - 由于这些 agent 没有 IN_CONTAINER 环境变量，不会 list-watch K8s 资源
  - 这些 agent 依然会获取 POD 的 IP 和 MAC
  - 这些 agent 完成所有的数据采集功能
  - server 向这些 agent 下发的采集器类型为 K8s

## 部署方法

### 部署 deployment 模式 DeepFlow Agent

```bash
cat << EOF > values-custom.yaml
deployMode: process
clusterNAME: process-example
EOF
helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```
部署后，将自动创建 Domain（对应此 K8s 集群），通过`deepflow-ctl domain list`中获取 `process-example` cluster 的 `kubernetes-cluster-id`，再继续下面的二进制安装

### 部署二进制模式 DeepFlow Agent

- 参考[传统服务器部署 DeepFlow Agent](../legacy-host/)，但无需创建 Domain
- 修改 agent 配置文件 `/etc/deepflow-agent/deepflow-agent.yaml`，`kubernetes-cluster-id` 填写上一步获取的 ID
