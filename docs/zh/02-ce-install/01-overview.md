---
title: 简介
permalink: /ce-install/overview
---

本章介绍 DeepFlow 的部署方法。DeepFlow 可用于监控多个 K8s 上的容器应用、多个 VPC 中的云主机应用。本章的内容安排如下：
- [all-in-one](./all-in-one/)：使用一台虚拟机快速体验 DeepFlow
- [single-k8s](./single-k8s/)：部署 DeepFlow 监控一个 K8s 集群上的所有应用，所有观测数据将会自动注入`K8s 资源`和`K8s 自定义 Label` 标签
- [multi-k8s](./multi-k8s/)：部署 DeepFlow 监控多个 K8s 集群上的所有应用
- [legacy-host](./legacy-host/)：部署 DeepFlow 监控传统服务器上的所有应用
- [cloud-host](./cloud-host/)：部署 DeepFlow 监控云服务器上的所有应用，所有观测数据将会自动注入`云资源`标签
- [managed-k8s](./managed-k8s/)：部署 DeepFlow 监控云服务商托管 K8s 集群上的所有应用，所有观测数据将会自动注入`云资源`、`K8s 资源`、`K8s 自定义 Label` 标签
- [serverless-pod](./serverless-pod/)：部署 DeepFlow 监控 Serverless Pod 内的所有应用
- [upgrade](./upgrade/)：DeepFlow 升级

# 在线 Demo 环境

如果你现在没有合适的资源部署 DeepFlow，也可登录我们的[在线 Demo](https://ce-demo.deepflow.yunshan.net)，
借助如下文档章节抢先体验 DeepFlow 的强大能力：
- [服务全景图 - 体验 DeepFlow 的 AutoMetrics 能力](../features/universal-map/auto-metrics/)
- [分布式追踪 - 体验 DeepFlow 的 AutoTracing 能力](../features/distributed-tracing/auto-tracing/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../features/auto-tagging/eliminate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../integration/input/metrics/metrics-auto-tagging/)
- [全栈分布式追踪 - 集成 OpenTelemetry 等追踪数据](../integration/input/tracing/full-stack-distributed-tracing/)

# 运行权限及内核要求

DeepFlow 中的 eBPF 能力（AutoTracing、AutoProfiling）对内核版本的要求如下：
| 体系架构 | 发行版                | 内核版本          | kprobe | Golang uprobe | OpenSSL uprobe | perf |
| -------- | --------------------- | ----------------- | ------ | ------------- | -------------- | ---- |
| X86      | CentOS 7.9            | 3.10.0 **[1]**    | Y      | Y **[2]**     | Y **[2]**      | Y    |
|          | RedHat 7.6            | 3.10.0 **[1]**    | Y      | Y **[2]**     | Y **[2]**      | Y    |
|          | \*                    | 4.9-4.13          |        |               |                | Y    |
|          | \*                    | 4.14 **[3]**      | Y      | Y **[2]**     |                | Y    |
|          | \*                    | 4.15              | Y      | Y **[2]**     |                | Y    |
|          | \*                    | 4.16              | Y      | Y             |                | Y    |
|          | \*                    | 4.17+             | Y      | Y             | Y              | Y    |
| ARM      | CentOS 8              | 4.18              | Y      | Y             | Y              | Y    |
|          | EulerOS               | 5.10+             | Y      | Y             | Y              | Y    |
|          | 麒麟 KylinOS V10 SP3+ | 4.19.90-52.25+    | Y      | Y             | Y              | Y    |
|          | 其他发行版            | 5.8+              | Y      | Y             | Y              | Y    |

对内核版本的额外说明：
- [1]: CentOS 7.9、RedHat 7.6 向 3.10 内核中[移植了一部分 eBPF 能力](https://www.redhat.com/en/blog/introduction-ebpf-red-hat-enterprise-linux-7)
  - 在这两个发行版中，DeepFlow 支持的详细内核版本如下（[依赖的 Hook 点](https://github.com/deepflowio/deepflow/blob/main/agent/src/ebpf/docs/probes-and-maps.md)）：
    - 3.10.0-957.el7.x86_64
    - 3.10.0-1062.el7.x86_64
    - 3.10.0-1127.el7.x86_64
    - 3.10.0-1160.el7.x86_64
  - 注意 RedHat 的申明：
    > The eBPF in Red Hat Enterprise Linux 7.6 is provided as Tech Preview and thus doesn't come with full support and is not suitable for deployment in production. It is provided with the primary goal to gain wider exposure, and potentially move to full support in the future. eBPF in Red Hat Enterprise Linux 7.6 is enabled only for tracing purposes, which allows attaching eBPF programs to probes, tracepoints and perf events.
- [2]: 容器内部的 Golang/OpenSSL 进程不支持
- [3]: 在内核 4.14 版本中，一个 `tracepoint` 不能被多个 eBPF program attach（如：不能同时运行两个或多个 deepflow-agent），其他版本不存在此问题

deepflow-agent 运行权限的要求：
- 当运行于 K8s 环境下，采集 K8s 信息需要的权限包括
  - `[必须]` 容器权限：`HOST_PID`
  - `[建议]` 内核权限：`SYS_ADMIN`
    - 不具备该权限时使用解析 ARP/ICMPV6 包获取 rootns 下网卡名、Pod IP 和 Pod MAC 的映射关系，并打印 WARN 日志
  - `[必须]` 内核权限：`SYS_PTRACE`
  - `[建议]` 文件权限：`/var/run/netns` 目录只读权限
    - 不具备该权限时，会影响获取容器网络命名空间的性能
    - deepflow-agent 会优先从这个目录获取容器的网络命名空间
    - 如果无法访问此目录则通过 `/proc/$pid/ns/net` 来获取容器的网络命名空间，此时有两个问题：
      - 进程停止了，这个文件会消失
      - 不同的 PID 可能对应同一个命名空间
- 采集 AF\_PACKET 流量需要的权限包括
  - `[必须]` 容器权限：`HOST_NET`
  - `[必须]` 内核权限：`NET_RAW`、`NET_ADMIN`
  - `[建议]` 内核权限：`IPC_LOCK`（包含 MAP\_LOCKED、MAP\_NORESERVE）
    - 不具备该权限时 cBPF 性能会受到显著影响，且会打印 WARN 日志提醒
- 采集 eBPF 数据需要的权限包括
  - `[必须]` 系统权限：`SELINUX = disabled`
  - `[建议]` 内核权限：`SYS_ADMIN`
    - 在内核 `Linux 5.8+` 下可以不需要 `SYS_ADMIN`，使用 `BPF` 和 `PERFMON` 的组合替代
    - 使用 `SYS_ADMIN` 权限无内核 `Linux 5.8+` 版本依赖
  - `[必须]` 内核权限：`SYS_RESOURCE`、`SYSLOG`
  - `[必须]` 文件权限：`/sys/kernel/debug/` 目录只读权限
    - 由于 kprobe、uprobe 类型探测点的 attach/detach 操作依赖于内核 debug 子系统，不具备该权限则无法开启 eBPF
    - 同时，由于该目录只能由 root 用户访问，所以 deepflow-agent 进程`只能以 root 用户运行`
  - `[必须]` 确保文件 `/proc/sys/kernel/kptr_restrict` 内容不等于 2，否则 Continuous Profiler 将不能使用
    - `kptr_restrict` 值为 2 时, 所有用户都无法读取内核符号地址，即使给予 `CAP_SYSLOG` 权限也无法读取内核地址
    - agent 在启动时会检测内核符号地址，如果无法读取会打印 WARN 日志提醒
    - 一般系统这个值默认为 1，如果这个值为 2 用户可提前将该文件内容设置为 1
  - `[建议]` 文件权限：`/proc/sys/net/core/bpf_jit_enable` 文件读写权限
    - 该文件内容不等于 1 时 eBPF 性能会受到显著影响
      - 当该值为 1 时，deepflow-agent 会读取该值，若不具备读取权限会打印 WARN 日志提醒
      - 当该值不为 1 时，deepflow-agent 会尝试修改为 1，若修改失败会打印 WARN 日志提醒
    - 如果希望在不赋予`写权限`的同时获得良好的 eBPF 性能，用户可提前将该文件内容设置为 1
    - K8s 下 deepflow-agent DaemonSet 会默认开启一个特权 init container 将该值设置为 1，使得 deepflow-agent 可运行于非特权模式下

deepflow-agent 调用 K8s apiserver 同步信息需要以下资源的 get/list/watch 权限：
- `nodes`
- `namespaces`
- `configmaps`
- `services`
- `pods`
- `replicationcontrollers`
- `daemonsets`
- `deployments`
- `replicasets`
- `statefulsets`
- `ingresses`
- `routes`

另外关联 K8s 标签信息需要对 CNI 进行适配，目前 DeepFlow 已适配的 CNI 包括：
- Flannel
- Calico
- Cilium
- Multus
- Open vSwitch
- Weave
- TKE GlobalRouter
- TKE VPC-CNI
- ACK Terway
- QKE HostNIC
- IPVlan
- MACVlan [额外配置](../best-practice/special-environment-deployment/#macvlan)
