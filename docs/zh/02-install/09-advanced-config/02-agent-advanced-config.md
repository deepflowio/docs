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

### 开启进程粒度的全景服务拓扑

默认情况下，DeepFlow 采集的全景服务拓扑（Universal Service Map）、指标数据、流日志、调用日志等数据中，auto\_instance 标签的最细粒度为 IP 地址所属的容器 Pod 或云服务器等资源。当希望为数据注入进程粒度的标签信息时，需要开启 Agent 的进程信息同步功能。

#### 所有配置项的 Yaml 文档

具体来讲涉及到如下 agent group config（[最新的 Yaml 文档参考 GitHub](https://github.com/deepflowio/deepflow/blob/main/server/controller/model/agent_group_config_example.yaml)）：
```yaml
static_config:
  ####################
  # Proc Monitoring ##
  ####################
  # whether to sync os socket and proc info
  # Default: false
  # Note: only make sense when agent type is one of CHOST_VM, CHOST_BM, K8S_VM, K8S_BM
  os-proc-sync-enabled: false

  # To sync tagged processed only
  # Default: false
  os-proc-sync-tagged-only: false

  # The proc fs mount path
  # Default: /proc
  os-proc-root: /proc

  # Socket scan and sync interval
  # Default: 10
  # Note: Note that the value unit is second.
  os-proc-socket-sync-interval: 10

  # Socket and Process uptime threshold
  # Default: 3
  # Note: Note that the value unit is second.
  os-proc-socket-min-lifetime: 3

  # The command execute and read the yaml from stdout
  # Default: []
  # Note: Execute the command every time when scan the process, expect get the process tag from stdout in yaml format,
  # the example yaml format as follow:
  #  - pid: 1
  #    tags:
  #    - key: xxx
  #      value: xxx
  #  - pid: 2
  #    tags:
  #    - key: xxx
  #      value: xxx
  os-app-tag-exec: ["cat", "/tmp/tag.yaml"]

  # The user who should execute the `os-app-tag-exec` command
  # Default: deepflow
  os-app-tag-exec-user: deepflow

  # the regular expression use for match process and replace the process name
  # Note: will traverse over the entire array, so the previous ones will be matched first.
  #   when match-type is parent_process_name, will recursive to match parent proc name, and rewrite-name field will ignore.
  #   rewrite-name can replace by regexp capture group and windows style environment variable, for example:
  #   `$1-py-script-%HOSTNAME%` will replace regexp capture group 1 and HOSTNAME env var.
  #   if proc not match any regexp will be accepted (essentially will auto append '- match-regex: .*' at the end).
  #
  # Example:
  #   os-proc-regex:
  #     - match-regex: python3 (.*)\.py
  #       match-type: cmdline
  #       action: accept
  #       rewrite-name: $1-py-script
  #     - match-regex: (?P<PROC_NAME>nginx)
  #       match-type: process_name
  #       rewrite-name: ${PROC_NAME}-%HOSTNAME%
  #     - match-regex: "nginx"
  #       match-type: parent_process_name
  #       action: accept
  #     - match-regex: .*sleep.*
  #       match-type: process_name
  #       action: drop
  #     - match-regex: .+ # match after concatenating a tag key and value pair using colon, i.e., an regex `app:.+` can match all processes has a `app` tag
  #       match-type: tag
  #       action: accept
  os-proc-regex:

   # The regexp use for match the process
   # Default: .*
   - match-regex:

     # Regexp match field
     # Default: process_name
     # Note: Options: process_name, cmdline, parent_process_name.
     match-type:

     # Action when RegExp match
     # Default: accept
     # Note: Options: accept, drop.
     action:

     # The name will replace the process name or cmd use regexp replace
     # Default: ""
     # Note: null string will not replace.
     rewrite-name:
```

#### 配置项说明

下面我们对上述配置进行逐个的解释。首先是一些基础配置：
- `os-proc-sync-enabled`：是否开启此功能，默认为 false
- `os-proc-root`：/proc 文件夹的 mount 位置，默认为 /proc，一般不用修改
- `os-proc-socket-sync-interval`：扫描进程 Socket 信息的间隔，默认为 10s，配置越低同步的实时性越高，但对 deepflow-server 的压力越大
- `os-proc-socket-min-lifetime`：仅同步存活周期在此阈值之上的进程及 Socket 信息，默认为 3s，配置越低同步的实时性越高，但对 deepflow-server 的压力越大

主要需要修改的配置：
- `os-proc-regex`：获取到本机所有进程的列表之后，对每一个进程依次执行所有的匹配动作，直到满足第一个 `match-regex` 为止来决定对此进程的处理
  - `match-regex`：使用该正则表达式匹配进程的 process\_name、cmdline 或 parent\_process\_name，仅命中的进程执行 `action` 对应的动作，默认值 `.*` 表示匹配任意进程
  - `match-type`: 正则表达式匹配的信息类型，默认值 process\_name 表示进程名，配置为 cmdline 表示进程的完整命令行、parent\_process\_name 表示父进程名
  - `action`：正则表达式命中的进程所执行的动作，默认值 accept 表示同步，配置为 drop 表示忽略
  - `rewrite-name`：将匹配的进程名替换为此名字

更高级的配置，用于将进程与 CMDB 中的业务标签信息关联。目前 DeepFlow Agent 支持执行一个脚本获取本机上的 PID 对应的标签信息：
- `os-proc-sync-tagged-only`：是否仅同步具有标签的进程的信息，默认为 false，此配置项可以方便的将不感兴趣的进程过滤掉
- `os-app-tag-exec`：获取进程标签的脚本命令行，使用方法详见 yaml 注释
- `os-app-tag-exec-user`：执行 `os-app-tag-exec` 中的命令行时使用的 Linux 用户，建议使用一个权限受限的用户执行命令行，为了安全起见默认值为 deepflow（而非 root）

#### 典型配置例

Yaml 注释中也有一些配置举例，下面增加一些更多的说明：
```yaml
static_config:
  os-proc-sync-enabled: true  # 开启功能
  os-proc-regex:  # 每个进程依次匹配如下四个规则
  - match-regex: "^(sleep|bash|sh|ssh|top|ps)$"  # 过滤一些通常不关心的、非业务进程
    action: drop
  - match-regex: python3 (.*)\.py  # 匹配 cmdline 符合 python3 xxxx.py 的进程，并将 xxxx 放到正则表达式的第一个匹配组中，在 rewrite-name 中可使用 $1 引用这个匹配组
    match-type: cmdline
    action: accept
    rewrite-name: $1-py-script
  - match-regex: nginx  # 匹配父进程名为 nginx 的进程。通常 nginx 有一个 master 进程和多个 worker 子进程，一般业务上主要关心 worker 子进程
    match-type: parent_process_name
    action: accept
  - match-regex: .*  # 如果不加此项，所有其他进程都会被 accept
    action: drop
```

一些有用的建议：
- `os-proc-regex` 规则末尾增加 `.*` + `drop` 的配置，以避免同步不关心的进程，减少同步的数据量
- python 和 java 进程一般需要通过 cmdline 来匹配，主要是因为他们的 process\_name 仅仅为 java 或 python，没有区分度，此时记得使用 `rewrite-name` 重写名字，否则会将完整的 cmdline 作为名称同步给 deepflow-server
- 如果 CD（持续部署）系统在云主机上有一个统一负责部署业务进程的进程，那么可以通过匹配 parent\_process\_name 快速匹配 CD 部署的所有进程，精简部署

#### 配置后的效果

DeepFlow 将为所有数据注入 gprocess 的标签，表示进程（经过 `rewrite-name` 处理后）的名称。且 auto\_instance 标签也会自动匹配到产生该条数据的 Socket 对应的 gprocess。除此之外，当配置了 os-app-tag-exec 时，进程的所有业务标签也会以 os.app.xxx 的标签字段自动注入到数据中。由于 DeepFlow Server 的存在，我们能在全景服务拓扑中查看到两个进程之间的访问信息，无论这两个进程实在一个或两个云主机上。Enjoy！

#### 限制说明

这里提到的方法适合于同步`使用长连接通信的进程`信息，由于短连接场景下 Socket 信息瞬息万变，可能还没等到同步至 DeepFlow Server 时 Socket 就已经关闭了，无法实现跨主机的进程信息标识。

实际上这个限制并不是无解的，DeepFlow 创新的提出了 [TOT (TCP Option Tracing)](https://github.com/deepflowio/tcp-option-tracing) 的 TCP Option 信息注入方法。我们可以在内核 5.10+ 的环境中利用 eBPF（或者在内核 3.10+ 的环境中利用 Kernel Module）自动向 TCP Option Header 中注入进程标识，实现更高性能的、无任何短连接遗漏的进程标签同步及标注能力。目前这项能力我们仅完成了 TOT 侧注入 TCP Option 的开发，DeepFlow Agent 侧利用 TCP Option 向所有观测信号中注入进程标签的工作还在规划中，敬请期待！

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

### 需要从 Kubernetes API 获取额外资源或 CRD 的情况

这类场景需要进行以下操作：
- 采集器高级配置中打开和关闭对应的资源
- 配置 Kubernetes API 权限

#### OpenShift

该场景需要关闭默认的 `Ingress` 资源获取，打开 `Route` 资源获取。

采集器高级配置如下：
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

#### 平安 ServiceRule

该场景下需要从 API 获取 `ServiceRule` 资源。

采集器高级配置如下：
    ```yaml
    static_config:
      kubernetes-resources:
      - name: servicerules
    ```

ClusterRole 配置增加：
    ```yaml
    rules:
    - apiGroups:
      - crd.pingan.org
      resources:
      - servicerules
      verbs:
      - get
      - list
      - watch
    ```

#### OpenKruise

该场景下需要从 API 获取 `CloneSet` 和 `apps.kruise.io/StatefulSet` 资源。

采集器高级配置如下：
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
