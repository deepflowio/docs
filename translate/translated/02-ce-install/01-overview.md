---
title: Introduction
permalink: /ce-install/overview
---

> This document was translated by ChatGPT

This chapter introduces the deployment methods of DeepFlow. DeepFlow can be used to monitor container applications on multiple K8s and cloud host applications in multiple VPCs. The content of this chapter is arranged as follows:

- [all-in-one](./all-in-one/): Quickly experience DeepFlow using a single virtual machine
- [single-k8s](./single-k8s/): Deploy DeepFlow to monitor all applications on a K8s cluster, with all observability data automatically injected into `K8s resources` and `K8s custom labels`
- [multi-k8s](./multi-k8s/): Deploy DeepFlow to monitor all applications across multiple K8s clusters
- [legacy-host](./legacy-host/): Deploy DeepFlow to monitor all applications on traditional servers
- [cloud-host](./cloud-host/): Deploy DeepFlow to monitor all applications on cloud servers, with all observability data automatically injected into `cloud resource` labels
- [managed-k8s](./managed-k8s/): Deploy DeepFlow to monitor all applications on cloud provider-managed K8s clusters, with all observability data automatically injected into `cloud resources`, `K8s resources`, and `K8s custom labels`
- [serverless-pod](./serverless-pod/): Deploy DeepFlow to monitor all applications within Serverless Pods
- [upgrade](./upgrade/): DeepFlow upgrade

# Online Demo Environment

If you currently do not have suitable resources to deploy DeepFlow, you can log in to our [online demo](https://ce-demo.deepflow.yunshan.net) to experience the powerful capabilities of DeepFlow through the following documentation sections:

- [Universal Service Map - Experience DeepFlow's AutoMetrics capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing capability](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Silos - Learn about DeepFlow's AutoTagging and SmartEncoding capabilities](../features/auto-tagging/eliminate-data-silos/)
- [Say Goodbye to High Base Troubles - Integrate metrics data such as Prometheus](../integration/input/metrics/metrics-auto-tagging/)
- [Full-Stack Distributed Tracing - Integrate tracing data such as OpenTelemetry](../integration/input/tracing/full-stack-distributed-tracing/)

# Running Permissions and Kernel Requirements

The eBPF capabilities (AutoTracing, AutoProfiling) in DeepFlow have the following kernel version requirements:
| Architecture | Distribution | Kernel Version | kprobe [1] | Golang uprobe | OpenSSL uprobe | perf |
| -------- | ------ | ------- | ---------- | ------------- | -------------- | ---- |
| X86 | CentOS 7.9 | 3.10.0-940+ **[2]** | Y | Y **[3]** | Y **[3]** | Y |
| | RedHat 7.6 | 3.10.0-940+ **[2]** | Y | Y **[3]** | Y **[3]** | Y |
| | \* | 4.14 **[4]** | Y | Y **[3]** | | Y |
| | \* | 4.15 | Y | Y **[3]** | | Y |
| | \* | 4.16 | Y | Y | | Y |
| | \* | 4.17+ | Y | Y | Y | Y |
| | SUSE 12 SP5 | 4.12 [5] | Y | Y | | Y |
| ARM | CentOS 8 | 4.18 | Y | Y | Y | Y |
| | EulerOS | 5.10+ | Y | Y | Y | Y |
| | KylinOS V10 SP1 | 4.19.90-23 [6] | Y | Y | Y | Y |
| | KylinOS V10 SP2 | 4.19.90-25.24+ [7] | Y | Y | Y | Y |
| | KylinOS V10 SP3 | 4.19.90-52.24+ | Y | Y | Y | Y |
| | Other Distributions | 5.8+ | Y | Y | Y | Y |

Additional notes on kernel versions:

- [1]: When Linux has BTF (BPF Type Format) enabled, and the kernel is greater than or equal to [5.5](https://github.com/torvalds/linux/commit/f1b9509c2fb0ef4db8d22dac9aef8e856a5d81f6) for X86 architecture, or greater than or equal to [6.0](https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/commit/?h=linux-6.0.y&id=efc9909fdce00a827a37609628223cd45bf95d0b) for ARM architecture, the agent will automatically use fentry/fexit instead of kprobe/kretprobe, resulting in approximately a 15% performance improvement.
- [2]: CentOS 7.9 and RedHat 7.6 have [ported some eBPF capabilities](https://www.redhat.com/en/blog/introduction-ebpf-red-hat-enterprise-linux-7) into the 3.10 kernel.
  - In these two distributions, the detailed kernel versions supported by DeepFlow are as follows ([dependent Hook points](https://github.com/deepflowio/deepflow/blob/main/agent/src/ebpf/docs/probes-and-maps.md)):
    - 3.10.0-957.el7.x86_64
    - 3.10.0-1062.el7.x86_64
    - 3.10.0-1127.el7.x86_64
    - 3.10.0-1160.el7.x86_64
  - Note RedHat's statement:
    > The eBPF in Red Hat Enterprise Linux 7.6 is provided as Tech Preview and thus doesn't come with full support and is not suitable for deployment in production. It is provided with the primary goal to gain wider exposure, and potentially move to full support in the future. eBPF in Red Hat Enterprise Linux 7.6 is enabled only for tracing purposes, which allows attaching eBPF programs to probes, tracepoints, and perf events.
- [3]: Golang/OpenSSL processes inside containers are not supported.
- [4]: In kernel version 4.14, a `tracepoint` cannot be attached by multiple eBPF programs (e.g., two or more deepflow-agents cannot run simultaneously), this issue does not exist in other versions.
- [5]: Currently supports SUSE 12 SP5 4.12.14, but the Linux community's 4.12 version still does not support it.
- [6]: Some kernels of KylinOS V10 SP1, such as 4.19.90-23.48.v2101.ky10.aarch64, run normally, but it is not guaranteed that all aarch64 architecture kernels of KylinOS V10 SP1 can run deepflow-agent normally.
- [7]: Some kernels of KylinOS V10 SP2, such as 4.19.90-24.4.v2101.ky10.aarch64, do not support `bpf_probe_read_user()` and cannot read any user-space data, thus not supporting AutoTracing functionality, but can support continuous profiling and file read/write tracing functions.

Requirements for running permissions of deepflow-agent:

- When running in a K8s environment, the permissions required to collect K8s information include:
  - `[Required]` Container permission: `HOST_PID`
  - `[Recommended]` Kernel permission: `SYS_ADMIN`
    - Without this permission, the mapping relationship between rootns network card name, Pod IP, and Pod MAC is obtained by parsing ARP/ICMPV6 packets, and a WARN log is printed.
  - `[Required]` Kernel permission: `SYS_PTRACE`
  - `[Recommended]` File permission: Read-only permission for the `/var/run/netns` directory
    - Without this permission, the performance of obtaining the container network namespace will be affected.
    - deepflow-agent will first obtain the container's network namespace from this directory.
    - If this directory cannot be accessed, the container's network namespace is obtained through `/proc/$pid/ns/net`, with two issues:
      - The process stops, and this file disappears.
      - Different PIDs may correspond to the same namespace.
- Permissions required to collect AF_PACKET traffic include:
  - `[Required]` Container permission: `HOST_NET`
  - `[Required]` Kernel permissions: `NET_RAW`, `NET_ADMIN`
  - `[Recommended]` Kernel permission: `IPC_LOCK` (including MAP_LOCKED, MAP_NORESERVE)
    - Without this permission, cBPF performance will be significantly affected, and a WARN log will be printed.
- Permissions required to collect eBPF data include:
  - `[Required]` System permission: `SELINUX = disabled`
  - `[Recommended]` Kernel permission: `SYS_ADMIN`
    - Under kernel `Linux 5.8+`, `SYS_ADMIN` is not required, and a combination of `BPF` and `PERFMON` can be used instead.
    - Using `SYS_ADMIN` permission has no kernel `Linux 5.8+` version dependency.
  - `[Required]` Kernel permissions: `SYS_RESOURCE`, `SYSLOG`
  - `[Required]` File permission: Read-only permission for the `/sys/kernel/debug/` directory
    - Since the attach/detach operations of kprobe and uprobe type probes depend on the kernel debug subsystem, eBPF cannot be enabled without this permission.
    - At the same time, since this directory can only be accessed by the root user, the deepflow-agent process `must run as the root user`.
  - `[Required]` Ensure that the content of the file `/proc/sys/kernel/kptr_restrict` is not equal to 2, otherwise Continuous Profiler cannot be used.
    - When `kptr_restrict` is set to 2, kernel symbol addresses cannot be read, even with `CAP_SYSLOG` permission.
    - The agent will check the value of `kptr_restrict` at startup, and if it cannot read the value, a WARN log will be printed.
    - If the value is 2, all users cannot read kernel symbol addresses, even with `CAP_SYSLOG` permission.
    - Generally, the default value of this parameter in systems is 1. If the value is 2, users can set the file content to 1 in advance.
  - `[Recommended]` File permission: Read/write permission for the `/proc/sys/net/core/bpf_jit_enable` file
    - When the content of this file is not equal to 1, eBPF performance will be significantly affected.
      - When the value is 1, deepflow-agent will read this value, and if it cannot read it, a WARN log will be printed.
      - When the value is not 1, deepflow-agent will try to modify it to 1, and if the modification fails, a WARN log will be printed.
    - If users want to obtain good eBPF performance without granting `write permission`, they can set the file content to 1 in advance.
    - The deepflow-agent DaemonSet in K8s will by default enable a privileged init container to set this value to 1, allowing the deepflow-agent to run in non-privileged mode.

The deepflow-agent requires get/list/watch permissions for the following resources to synchronize information with the K8s apiserver:

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

Additionally, associating K8s label information requires adaptation to CNI. Currently, DeepFlow is adapted to the following CNIs:

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
- MACVlan [additional configuration](../best-practice/special-environment-deployment/#macvlan)