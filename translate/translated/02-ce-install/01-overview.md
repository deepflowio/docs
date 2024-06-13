---
title: Introduction
permalink: /ce-install/overview
---

> This document was translated by ChatGPT

This chapter introduces the deployment methods of DeepFlow. DeepFlow can be used to monitor container applications on multiple K8s clusters and cloud host applications in multiple VPCs. The content of this chapter is arranged as follows:

- [all-in-one](./all-in-one/): Quickly experience DeepFlow using a single virtual machine
- [single-k8s](./single-k8s/): Deploy DeepFlow to monitor all applications on a K8s cluster, with all observability data automatically injected into `K8s resources` and `K8s custom labels`
- [multi-k8s](./multi-k8s/): Deploy DeepFlow to monitor all applications on multiple K8s clusters
- [legacy-host](./legacy-host/): Deploy DeepFlow to monitor all applications on traditional servers
- [cloud-host](./cloud-host/): Deploy DeepFlow to monitor all applications on cloud servers, with all observability data automatically injected into `cloud resources` labels
- [managed-k8s](./managed-k8s/): Deploy DeepFlow to monitor all applications on cloud service provider managed K8s clusters, with all observability data automatically injected into `cloud resources`, `K8s resources`, and `K8s custom labels`
- [serverless-pod](./serverless-pod/): Deploy DeepFlow to monitor all applications within Serverless Pods
- [upgrade](./upgrade/): DeepFlow upgrade

# Online Demo Environment

If you currently do not have suitable resources to deploy DeepFlow,
you can log into our [Online Demo](https://ce-demo.deepflow.yunshan.net) to experience the powerful capabilities of DeepFlow with the following documentation chapters:

- [Universal Service Map - Experience DeepFlow's AutoMetrics capability](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing capability](../features/distributed-tracing/auto-tracing/)
- [Eliminating Data Silos - Understand DeepFlow's AutoTagging and SmartEncoding capabilities](../features/auto-tagging/eliminate-data-silos/)
- [Say Goodbye to High Cardinality Issues - Integrate Prometheus and other metrics data](../integration/input/metrics/metrics-auto-tagging/)
- [Full-Stack Distributed Tracing - Integrate OpenTelemetry and other tracing data](../integration/input/tracing/full-stack-distributed-tracing/)

# Running Permissions and Kernel Requirements

The eBPF capabilities (AutoTracing, AutoProfiling) in DeepFlow have the following kernel version requirements:
| Architecture | Distribution | Kernel Version | kprobe | Golang uprobe | OpenSSL uprobe | perf |
| ------------ | ------------------- | -------------- | ------ | ------------- | -------------- | ---- |
| X86 | CentOS 7.9 | 3.10.0 **[1]** | Y | Y **[2]** | Y **[2]** | Y |
| | RedHat 7.6 | 3.10.0 **[1]** | Y | Y **[2]** | Y **[2]** | Y |
| | \* | 4.9-4.13 | | | | Y |
| | \* | 4.14 **[3]** | Y | Y **[2]** | | Y |
| | \* | 4.15 | Y | Y **[2]** | | Y |
| | \* | 4.16 | Y | Y | | Y |
| | \* | 4.17+ | Y | Y | Y | Y |
| ARM | CentOS 8 | 4.18 | Y | Y | Y | Y |
| | EulerOS | 5.10+ | Y | Y | Y | Y |
| | KylinOS V10 SP3+ | 4.19.90-52.25+ | Y | Y | Y | Y |
| | Other Distributions | 5.8+ | Y | Y | Y | Y |

Additional notes on kernel versions:

- [1]: CentOS 7.9, RedHat 7.6 have [backported some eBPF capabilities](https://www.redhat.com/en/blog/introduction-ebpf-red-hat-enterprise-linux-7) to the 3.10 kernel
  - In these two distributions, the detailed kernel versions supported by DeepFlow are as follows ([dependent hook points](https://github.com/deepflowio/deepflow/blob/main/agent/src/ebpf/docs/probes-and-maps.md)):
    - 3.10.0-957.el7.x86_64
    - 3.10.0-1062.el7.x86_64
    - 3.10.0-1127.el7.x86_64
    - 3.10.0-1160.el7.x86_64
  - Note RedHat's statement:
    > The eBPF in Red Hat Enterprise Linux 7.6 is provided as Tech Preview and thus doesn't come with full support and is not suitable for deployment in production. It is provided with the primary goal to gain wider exposure, and potentially move to full support in the future. eBPF in Red Hat Enterprise Linux 7.6 is enabled only for tracing purposes, which allows attaching eBPF programs to probes, tracepoints and perf events.
- [2]: Golang/OpenSSL processes inside containers are not supported
- [3]: In kernel version 4.14, a `tracepoint` cannot be attached by multiple eBPF programs (e.g., cannot run two or more deepflow-agent simultaneously), this issue does not exist in other versions

Requirements for running deepflow-agent:

- When running in a K8s environment, the permissions required to collect K8s information include:
  - `[Mandatory]` Container permission: `HOST_PID`
  - `[Recommended]` Kernel permission: `SYS_ADMIN`
    - Without this permission, the mapping of network interface names, Pod IPs, and Pod MACs under rootns is obtained by parsing ARP/ICMPV6 packets, and WARN logs are printed
  - `[Mandatory]` Kernel permission: `SYS_PTRACE`
  - `[Recommended]` File permission: Read-only access to the `/var/run/netns` directory
    - Without this permission, it will affect the performance of obtaining container network namespaces
    - deepflow-agent will preferentially obtain the network namespace of containers from this directory
    - If access to this directory is not possible, the container's network namespace is obtained through `/proc/$pid/ns/net`, which has two issues:
      - If the process stops, the file will disappear
      - Different PIDs may correspond to the same namespace
- Permissions required to collect AF_PACKET traffic:
  - `[Mandatory]` Container permission: `HOST_NET`
  - `[Mandatory]` Kernel permissions: `NET_RAW`, `NET_ADMIN`
  - `[Recommended]` Kernel permission: `IPC_LOCK` (including MAP_LOCKED, MAP_NORESERVE)
    - Without this permission, cBPF performance will be significantly affected, and WARN logs will be printed
- Permissions required to collect eBPF data:
  - `[Mandatory]` System permission: `SELINUX = disabled`
  - `[Recommended]` Kernel permission: `SYS_ADMIN`
    - Under kernel `Linux 5.8+`, `SYS_ADMIN` can be replaced with a combination of `BPF` and `PERFMON`
    - `SYS_ADMIN` permission does not depend on kernel `Linux 5.8+` version
  - `[Mandatory]` Kernel permissions: `SYS_RESOURCE`, `SYSLOG`
  - `[Mandatory]` File permission: Read-only access to the `/sys/kernel/debug/` directory
    - As the attach/detach operations of kprobe and uprobe type probes rely on the kernel debug subsystem, without this permission, eBPF cannot be enabled
    - Additionally, since this directory can only be accessed by the root user, the deepflow-agent process `must run as the root user`
  - `[Mandatory]` Ensure that the file `/proc/sys/kernel/kptr_restrict` content is not equal to 2, otherwise Continuous Profiler cannot be used
    - When the `kptr_restrict` value is 2, all users cannot read kernel symbol addresses, even with `CAP_SYSLOG` permission
    - The agent will check the kernel symbol address at startup, and if it cannot be read, a WARN log will be printed
    - Generally, this value defaults to 1, if it is 2, users can set the file content to 1 in advance
  - `[Recommended]` File permission: Read and write access to the `/proc/sys/net/core/bpf_jit_enable` file
    - If the content of this file is not equal to 1, eBPF performance will be significantly affected
      - When this value is 1, deepflow-agent will read the value and print WARN logs if read permission is not granted
      - When this value is not 1, deepflow-agent will attempt to change it to 1 and print WARN logs if the modification fails
    - If you want to get good eBPF performance without granting `write permission`, users can set the file content to 1 in advance
    - In K8s, the deepflow-agent DaemonSet will by default enable a privileged init container to set this value to 1, allowing deepflow-agent to run in non-privileged mode

Permissions required for deepflow-agent to call K8s apiserver to synchronize information include get/list/watch permissions on the following resources:

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

Additionally, associating K8s label information requires CNI adaptation. DeepFlow currently supports the following CNIs:

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
