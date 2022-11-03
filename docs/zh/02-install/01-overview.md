---
title: 简介
permalink: /install/overview
---

本章介绍 DeepFlow 的部署方法。DeepFlow 可用于监控多个 K8s 上的容器应用、多个 VPC 中的云主机应用。本章的内容安排如下：
- [all-in-one](./all-in-one/)：使用一台虚拟机快速体验 DeepFlow
- [single-k8s](./single-k8s/)：部署 DeepFlow 监控一个 K8s 集群上的所有应用，所有观测数据将会自动注入`K8s 资源`和`K8s 自定义 Label`标签
- [multi-k8s](./multi-k8s/)：部署 DeepFlow 监控多个 K8s 集群上的所有应用
- [legacy-host](./legacy-host/)：部署 DeepFlow 监控传统服务器上的所有应用
- [cloud-host](./cloud-host/)：部署 DeepFlow 监控云服务器上的所有应用，所有观测数据将会自动注入`云资源`标签
- [managed-k8s](./managed-k8s/)：部署 DeepFlow 监控云服务商托管 K8s 集群上的所有应用，所有观测数据将会自动注入`云资源`、`K8s 资源`、`K8s 自定义 Label`标签
- [upgrade](./upgrade/)：DeepFlow 升级
- [advanced-config](./advanced-config/)：DeepFlow 高级配置

# 在线 Demo 环境

如果你现在没有合适的资源部署 DeepFlow，也可登录我们的[在线 Demo](https://ce-demo.deepflow.yunshan.net)（用户名/密码均为 `deepflow`），
借助如下文档章节抢先体验 DeepFlow 的强大能力：
- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无盲点分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)

# 运行权限及内核要求

deepflow-agent 的 eBPF 能力对内核版本的要求：
- X86 体系架构：Linux Kernel 4.14+
  - 例外：使用 uprobe 采集 openssl 库的 TLS 应用数据要求 Linux Kernel 4.17+
- ARM64 体系架构：CentOS8 Linux Kernel 4.18，或社区 Linux Kernel 5.8+

当内核版本无法满足要求时，受影响的功能有：
- 通过 eBPF uprobe 获取 HTTP2、HTTPS 应用数据
- 通过 eBPF 实现 AutoTracing

deepflow-agent 运行权限的要求：
- 当运行于 K8s 环境下，采集 K8s 信息需要的权限包括
  - `[必须]` 容器权限：`HOST_PID`
  - `[必须]` 内核权限：`SYS_ADMIN`、`SYS_PTRACE`
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
  - `[必须]` 内核权限：`SYS_ADMIN`、`SYS_RESOURCE`
    - 在内核 `Linux 5.8+` 下可以不需要 `SYS_ADMIN`，使用 `BPF` 替代
  - `[必须]` 文件权限：`/sys/kernel/debug/` 目录只读权限
    - 由于 kprobe、uprobe 类型探测点的 attach/detach 操作依赖于内核 debug 子系统，不具备该权限则无法开启 eBPF
    - 同时，由于该目录只能由 root 用户访问，所以 deepflow-agent 进程`只能以 root 用户运行`
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
