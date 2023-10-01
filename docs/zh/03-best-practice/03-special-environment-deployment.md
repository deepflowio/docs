---
title: 特殊环境部署
permalink: /best-practice/special-environment-deployment/
---

# 特殊 CNI

## MACVlan

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

# 特殊 K8s 资源或 CRD

这类场景需要进行以下操作：
- Agent 高级配置中打开和关闭对应的资源
- 配置 Kubernetes API 权限

## OpenShift

该场景需要关闭默认的 `Ingress` 资源获取，打开 `Route` 资源获取。

Agent 高级配置如下：
```yaml
static_config:
  kubernetes-resources:
  - name: ingresses
    disabled: true
  - name: routes
```

ClusterRole 配置增加：
```yaml
rules:
- apiGroups:
  - route.openshift.io
  resources:
  - routes
  verbs:
  - get
  - list
  - watch
```

## OpenKruise

该场景下需要从 API 获取 `CloneSet` 和 `apps.kruise.io/StatefulSet` 资源。

Agent 高级配置如下：
```yaml
static_config:
  kubernetes-resources:
  - name: clonesets
    group: apps.kruise.io
  - name: statefulsets
    group: apps
  - name: statefulsets
    group: apps.kruise.io
```

注意这里需要加上 Kubernetes 的 `apps/StatefulSet`。

ClusterRole 配置增加：
```yaml
- apiGroups:
  - apps.kruise.io
  resources:
  - clonesets
  - statefulsets
  verbs:
  - get
  - list
  - watch
```

# 受限的 Agent 运行权限

## 无 Daemonset 部署权限

当没有在 Kubernetes 集群中运行 Daemonset 的权限、但可在 K8s Node 上直接运行普通进程时，可使用该方法实现 Agent 部署。

- 以 deployment 形态部署一个 deepflow-agent
  - 通过设置环境变量 `ONLY_WATCH_K8S_RESOURCE`，该 agent 仅实现对 K8s 资源的 list-watch 及上送控制器的功能
  - 这个 agent 的其他所有功能均会自动关闭
  - agent 请求 server 时告知自己在 watch-k8s，server 会将此信息更新到 MySQL 数据库中
  - 这个仅用做 Watcher 的 Agent 将不会出现在 Agent 列表中
- 在这个 K8s 集群中，以 Linux 进程的形态在每个 K8s Node 上运行一个常规功能的 deepflow-agent
  - 由于这些 agent 没有 `IN_CONTAINER` 环境变量，不会 list-watch K8s 资源
  - 这些 agent 依然会获取 POD 的 IP 和 MAC 地址并同步到 server
  - 这些 agent 将完成所有的观测数据采集功能
  - server 向这些 agent 下发的 Agent 类型为 K8s

### 部署 deployment 模式 DeepFlow Agent

```bash
cat << EOF > values-custom.yaml
deployComponent:
- "watcher"
clusterNAME: process-example
EOF

helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```
部署后，将自动创建 Domain（对应此 K8s 集群），通过`deepflow-ctl domain list`中获取 `process-example` cluster 的 `kubernetes-cluster-id`，再继续下面的操作。

### 部署普通进程形式的 DeepFlow Agent

- 参考[传统服务器部署 DeepFlow Agent](../install/legacy-host/)，但无需创建 Domain
- 修改 agent 配置文件 `/etc/deepflow-agent/deepflow-agent.yaml`，`kubernetes-cluster-id` 填写上一步获取的集群 ID

## 不允许请求 apiserver

默认情况下 DeepFlow Agent 在 K8s 中以 Daemonset 方式运行。但有些情况下为了保护 apiserver 避免过载，Daemonset 不允许对 apiserver 请求。此时也可使用本文中「无 Daemonset 部署权限」的类似方式进行部署：
- 部署一个 deepflow-agent deployment，仅负责 list-watch apiserver、同步 K8s 资源信息
- 部署一个 deepflow-agent daemonset，任何 Pod 都不会 list-watch apiserver
