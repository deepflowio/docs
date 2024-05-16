---
title: 特殊环境 Agent 部署
permalink: /best-practice/special-environment-deployment/
---

# 特殊的 K8s CNI

在常见 K8s 环境中，DeepFlow Agent 可以采集到全栈观测信号，如下图左上角所示：
- 同一个 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 和 cBPF Pod NIC 两种位置的数据
- 不同的 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall、cBPF Pod NIC 以及 cBPF Node NIC 三种位置的数据

![不同 K8s CNI 下的数据采集能力（Pod 与 Pod 通信场景）](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231114002715.png)

但是，在某些 CNI 下，由于流量路径的特殊性，DeepFlow Agent 采集到的数据会有差异：
- 在 Cilium CNI 环境中（上图右上角）：
  - Cilium [使用 XDP](https://docs.cilium.io/en/stable/network/ebpf/intro/) 将网络绕过了 TCP/IP 协议栈，导致名为 lxc-xxx 的 Pod NIC 上只能看到单向流量
  - 同一个 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 一种位置的数据
  - 不同的 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 和 cBPF Node NIC 两种位置的数据，后者采集自 Node eth0
- 在 MACVlan、[华为云 CCE Turbo](https://support.huaweicloud.com/usermanual-cce/cce_10_0284.html) 等 CNI 环境中（上图左下角）：
  - 使用 MACVlan 子接口而非 Veth-Pair + Bridge，此时在 Root Netns 中没有对应的 Pod NIC，但是能在 Node eth0 上看到所有 Pod 的所有流量
  - 此时，DeepFlow Agent 可参照下文配置 `tap_mode = 1 (virtual mirror)`，将 Node NIC 上的流量`等同于视为`是在 Pod NIC 上采集到的
  - 同一个 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 和 cBPF Pod NIC 两种位置的数据，后者采集自 Node eth0
    - 不过，由于 eth0 上只有一份通信流量，因此客户端、服务端共享一份 cBPF Pod NIC 位置的数据
  - 不同的 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 和 cBPF Pod NIC 两种位置的数据，后者采集自 Node eth0
- 在 IPVlan CNI 环境中（上图右下角）：
  - 使用 IPVlan 子接口而非 Veth-Pair + Bridge，此时在 Root Netns 中没有对应的 Pod NIC，且仅能在 Node eth0 上看到 Pod 进出 Node 的流量
  - 同一个 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 一种位置的数据
  - 不同的 Node 上的两个 Pod 互访时，可采集到 eBPF Syscall 和 cBPF Node NIC 两种位置的数据，后者采集自 Node eth0

另外，eBPF XDP 还可以与 IPVlan 混合使用（例如[阿里云的 Terway CNI](https://developer.aliyun.com/article/1221415)），此时的流量采集能力等同于 Cilium 或 IPVlan。

一些参考资料：
- [Bridge vs Macvlan](https://hicu.be/bridge-vs-macvlan)
- [Macvlan vs Ipvlan](https://hicu.be/macvlan-vs-ipvlan)
- [Packet Walk(s) In Kubernetes](https://events19.linuxfoundation.org/wp-content/uploads/2018/07/Packet_Walks_In_Kubernetes-v4.pdf)

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
    ## Regular Expression for TAP (Traffic Access Point)
    ## Length: [0, 65535]
    ## Default:
    ##   Localhost:   lo
    ##   Common NIC:  eth.*|en[osipx].*
    ##   QEMU VM NIC: tap.*
    ##   Flannel:     veth.*
    ##   Calico:      cali.*
    ##   Cilium:      lxc.*
    ##   Kube-OVN:    [0-9a-f]+_h$
    ## Note: Regular expression of NIC name for collecting traffic
    tap_interface_regex: eth0
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

## 华为云 CCE Turbo

参考 MACVlan 配置方法即可。

## IPVlan

唯一需要注意的是，采集器的 tap_interface_regex 只需配置为 Node NIC 列表。

## Cilium eBPF

唯一需要注意的是，采集器的 tap_interface_regex 只需配置为 Node NIC 列表。

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

## 无 K8s Daemonset 部署权限

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
clusterNAME: your-cluster-name
EOF

helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```
部署后，将自动创建 Domain（对应此 K8s 集群），通过`deepflow-ctl domain list`中获取 `your-cluster-name` cluster 的 `kubernetes-cluster-id`，再继续下面的操作。

### 部署普通进程形式的 DeepFlow Agent

- 参考[传统服务器部署 DeepFlow Agent](../ce-install/legacy-host/)，但无需创建 Domain
- 修改 agent 配置文件 `/etc/deepflow-agent/deepflow-agent.yaml`，`kubernetes-cluster-id` 填写上一步获取的集群 ID

## 不允许 Daemonset 请求 apiserver

默认情况下 DeepFlow Agent 在 K8s 中以 Daemonset 方式运行。但有些情况下为了保护 apiserver 避免过载，Daemonset 不允许对 apiserver 请求。此时也可使用本文中「无 Daemonset 部署权限」的类似方式进行部署：
- 部署一个 deepflow-agent deployment，仅负责 list-watch apiserver、同步 K8s 资源信息
- 部署一个 deepflow-agent daemonset，任何 Pod 都不会 list-watch apiserver

## 使用非 root 用户运行 deepflow-agent

本次示例中，普通用户名为 deepflow，进程存放在 /usr/sbin/deepflow-agent，通过 deepflow 用户启动 deepflow-agent 时，须先通过 root 用户添加权限：

```bash
## Use the root user to grant execution permissions to the deepflow-agent
setcap cap_sys_ptrace,cap_net_raw,cap_net_admin,cap_ipc_lock,cap_sys_admin=eip /usr/sbin/deepflow-agent
mkdir /sys/fs/cgroup/cpu/deepflow-agent
mkdir /sys/fs/cgroup/memory/deepflow-agent
chown -R deepflow:deepflow /sys/fs/cgroup/cpu/deepflow-agent
chown -R deepflow:deepflow /sys/fs/cgroup/memory/deepflow-agent
chown -R deepflow:deepflow /usr/sbin/deepflow-agent
chown -R deepflow:deepflow /usr/sbin/deepflow-agent
```

使用非 root 用户运行 deepflow-agent

```bash
/usr/sbin/deepflow-agent -f /etc/deepflow-agent.yaml
```

卸载 deepflow-agent 时删除对应权限：

```bash
## Use the root user to revoke execution permissions from the deepflow-agent
setcap -r /usr/sbin/deepflow-agent
rmdir /sys/fs/cgroup/cpu/deepflow-agent
rmdir /sys/fs/cgroup/memory/deepflow-agent
```

## 不允许 deepflow-agent 请求 apiserver

deepflow-server 依赖 deepflow-agent 上报的 K8s 资源信息来实现 AutoTagging 能力，当你的环境不允许 deepflow-agent 直接 Watch K8s apiserver 时，你可以自己实现一个专门用于同步 K8s 资源的 pseudo-deepflow-gent。这个 pseudo-deepflow-agent 需要实现的功能包括：
- 周期性的 List-Watch K8s apiserver 以获取最新的 K8s 资源信息
- 调用 deepflow-server 的 gRPC 接口上报 K8s 资源信息

### gRPC 接口

上报 K8s 资源信息的接口为（[GitHub 代码链接](https://github.com/deepflowio/deepflow/blob/main/message/trident.proto#L15)）：
```protobuf
rpc KubernetesAPISync(KubernetesAPISyncRequest) returns (KubernetesAPISyncResponse) {}
```

pseudo-deepflow-agent 上报消息的结构体说明（GitHub 代码链接同上）：
```protobuf
message KubernetesAPISyncRequest {
    // 如无特殊说明，以下字段均必须携带。

    // K8s 集群标识。
    // 请使用同一个 K8s 集群中 deepflow-agent.yaml 所配置的值。
    optional string cluster_id = 1;

    // 资源信息的版本号。
    // 当 K8s 资源信息发生变化时，请确保此版本号也要进行改变，通常可使用 Linux Epoch。
    // 当 K8s 资源信息没有变化时，携带上一次的版本号，此时 entries 无需传输。
    // 即使资源信息没有变化，也要周期性请求 deepflow-server，保证两次请求间隔不要超过 24 小时。
    optional uint64 version = 2;

    // 异常信息。
    // 当调用 K8s API 异常，或者发生其他错误时，可通过此字段告知 deepflow-server。
    // 当存在 error_msg 时，建议携带上一次请求使用的 version 和 entries 字段。
    optional string error_msg = 3;

    // Source IP 地址。
    // 通常可填写为 pseudo-deepflow-agent 请求 gRPC 时使用的客户端 IP 地址。
    // 使用有代表性、区分性的 source_ip 能够方便查阅 deepflow-server 日志，定位请求者。
    optional string source_ip = 5;

    // 各类 K8s 资源的所有信息。
    // 请注意需要包括所有类型的所有资源，未出现的资源将会被 deepflow-server 认为已删除。
    repeated common.KubernetesAPIInfo entries = 10;
}

message KubernetesAPIInfo {
    // K8s 资源类型，当前支持的资源类型有：
    // - *v1.Node
    // - *v1.Namespace
    // - *v1.Deployment
    // - *v1.StatefulSet
    // - *v1.DaemonSet
    // - *v1.ReplicationController
    // - *v1.ReplicaSet
    // - *v1.Pod
    // - *v1.Service
    // - *v1beta1.Ingress
    optional string type = 1;

    // 该类型的资源列表。
    // 注意：请使用 JSON 序列化，之后使用 zlib 进行压缩，传输压缩后的字节流即可。
    optional bytes compressed_info = 3;
}
```

deepflow-server 回复消息的结构体说明（GitHub 代码链接同上）：
```protobuf
message KubernetesAPISyncResponse {
    // deepflow-server 已经接受的资源信息版本号，通常等于最近一次请求中的 version。
    optional uint64 version = 1;
}
```

### 对 KubernetesAPIInfo 的说明

注意：deepflow-server 要求某些 K8s 资源类型必须上报包括：
- `*v1.Node`
- `*v1.Namespace`
- `*v1.Pod`
- `*v1.Deployment`、`*v1.StatefulSet`、`*v1.DaemonSet`、`*v1.ReplicationController`、`*v1.ReplicaSet`：根据 Pod 的工作负载类型按需上报即可

除此之外的其他资源可以不上报：
- `*v1.Service`
- `*v1beta1.Ingress`

下面我们依次介绍各类资源在上报时必须要携带的字段信息，各个字段的值类型可参考 `kubectl get XXX -o json` 命令的输出。

#### *v1.Node 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx"                                 // 名称
    },
    "status": {
        "addresses": [
            {
                "address": "x.x.x.x", // Node IP
                "type": "InternalIP"
            }
        ],
        "conditions": [
            {
                "reason": "KubeletReady", // 用于判断 Node 状态
                "status": "True"          // 用于判断 Node 状态
            }
        ]
    },
    "spec": {
        "podCIDR": "x.x.x.x/x" // 用于获取该 Node 使用的 POD Cidr
    }
}
```

#### *v1.Namespace 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx"                                 // 名称
    }
}
```

#### *v1.Deployment/StatefulSet/DaemonSet/ReplicationController 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx",                           // 所属 namespace 的名称
        "labels": {                                    // labels，可以上传空字典
            "key1": "value1"
        }
    },
    "spec": {
        "replicas": 1
    }
}
```

#### *v1.ReplicaSet 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx",                           // 所属 namespace 的名称
        "labels": {                                    // labels，可以上传空字典
            "key1": "value1"
        },
        "ownerReferences": {                           // 所属工作负载信息
            "name": "xxxx",
            "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
    },
    "spec": {
        "replicas": 1
    }
}
```

#### *v1.Pod 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx",                           // 所属 namespace 的名称
        "labels": {                                    // labels，当不上报 *v1.Service 资源时可以上传空字典
            "key1": "value1"
        },
        "ownerReferences": [                           // 所属工作负载信息
            {
                // 工作负载类型
                // 目前支持：DaemonSet/Deployment/ReplicaSet/StatefulSet/ReplicationController
                "kind": "xxxx",
                "name": "xxxx",
                "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
        ],
        "creationTimestamp": "2024-04-29T10:02:38Z",   // 创建时间
        "generate_name": "xxxx"                        // 仅 StatefulSet 的 Pod 需要携带
    },
    "status": {
        "hostIP": "x.x.x.x", // Node IP
        "podIP": "x.x.x.x",  // Pod IP
        "conditions" : [     // POD 状态
            {
                "type": "xxxx",
                "status": "xxxx"
            }
        ],
        "containerStatuses" : [
            {
                "containerID": "containerd://xxxxxxxxxxxx...", // POD 中的 container 标识
            }
        ]
    }
}
```

#### *v1.Service 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx",                           // 所属 namespace 的名称
        "labels": {                                    // labels，可以上传空字典
            "key1": "value1"
        }
    },
    "spec": {
        "clusterIP": "x.x.x.x",
        "ports": [
            {
                "name": "xxxx",
                "nodePort": xxxx,
                "port": xxxx,
                "protocol": "xxxx",
                "targetPort": xxxx
            }
        ],
        "selector": { // selector 中是 label 信息，service 通过 selector 中的 label 与 Pod 关联
            "key": "value"
        },
        "type": "xxxx" // 当前支持 NodePort 和 ClusterIP
    }
}
```

#### *v1beta1.Ingress 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx"                            // 所属 namespace 的名称
    },
    "spec": {
        "rules": [ // 转发规则
            {
                "host": "", // 域名
                "http": {   // 目前仅支持 http 协议
                    "paths": [
                        {
                            "path": "",   // 路径
                            "backend": {  // 后端服务信息
                                "service": {
                                    "name": "",
                                    "port": {
                                        "number": xxxx
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```
