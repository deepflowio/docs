> This document was translated by GPT-4

---

title: Overview
permalink: /ce-install/overview

---

This chapter introduces the deployment methods of DeepFlow. DeepFlow can be used to monitor container applications on multiple K8s and cloud host applications in multiple VPCs. The content of this chapter is arranged as follows：

- [all-in-one](./all-in-one/): Use a virtual machine to quickly experience DeepFlow
- [single-k8s](./single-k8s/): Deploy DeepFlow to monitor all applications on a K8s cluster, all observability data will be automatically injected with `K8s resource` and `K8s custom Label` tags
- [multi-k8s](./multi-k8s/): Deploy DeepFlow to monitor all applications on multiple K8s clusters
- [legacy-host](./legacy-host/): Deploy DeepFlow to monitor all applications on traditional servers
- [cloud-host](./cloud-host/): Deploy DeepFlow to monitor all applications on cloud servers, all observability data will be automatically injected with `cloud resource` tags
- [managed-k8s](./managed-k8s/): Deploy DeepFlow to monitor all applications on Managed K8s clusters provided by cloud service providers, all observability data will be automatically injected with `cloud resource`, `K8s resource`, `K8s custom Label` tags
- [serverless-pod](./serverless-pod/): Deploy DeepFlow to monitor all applications in Serverless Pod
- [upgrade](./upgrade/): Upgrade DeepFlow

# Online Demo Environment

If you do not have suitable resources to deploy DeepFlow at present, you can also log in to our [Online Demo](https://ce-demo.deepflow.yunshan.net), and with the help of the following document chapters, you can experience the powerful capabilities of DeepFlow in advance：

- [Universal Service Map - Experience DeepFlow's AutoMetrics Capabilities](../features/universal-map/auto-metrics/)
- [Distributed Tracing - Experience DeepFlow's AutoTracing Capabilities](../features/distributed-tracing/auto-tracing/)
- [Eliminate Data Islands - Understand DeepFlow's AutoTagging and SmartEncoding Capabilities](../features/auto-tagging/elimilate-data-silos/)
- [Say Goodbye to High-Base Worries - Integrate Promethes and other metrics data](../integration/input/metrics/metrics-auto-tagging/)
- [Full Stack Distributed Tracing - Integrate OpenTelemetry and other tracing data](../integration/input/tracing/full-stack-distributed-tracing/)

# Runtime privileges and kernel requirements

The eBPF capabilities of deepflow-agent have the following kernel version requirements：

- X86 architecture：Linux Kernel 4.14+
  - Exception: Using uprobe to collect the application data of the TLS library requires Linux Kernel 4.17+
  - Under the kernel `Linux 4.14` a `tracepoint` cannot be attached by multiple eBPF programs (i.e., cannot run two or more agents at the same time), `Linux 4.15+` does not have this problem
- ARM64 architecture：
  - Linux Kernel 5.8+ in the community
  - CentOS8 Linux Kernel 4.18
  - EulerOS Linux Kernel 5.10+
  - KylinOS V10 SP3+ 4.19.90-52.25

When the kernel version cannot meet the requirements, the affected functions include：

- Obtain HTTP2、HTTPS application data through eBPF uprobe
- AutoTracing、AutoProfiling implemented by eBPF

The running rights required by the deepflow-agent are：

- When running in a K8s environment, the permissions needed to collect K8s information include
  - `[Must have]` Container rights：`HOST_PID`
  - `[Recommended]` Kernel rights：`SYS_ADMIN`
    - Without this authority, the package of ARP/ICMPV6 will be parsed to obtain the mapping relationship between the network card name under rootns, Pod IP and Pod MAC, and the WARN log will be printed
  - `[Must have]` Kernel rights：`SYS_PTRACE`
  - `[Recommended]` File rights：Read-only permission of `/var/run/netns` directory
    - Without this authority, it will affect the performance of obtaining the container network namespace
    - deepflow-agent will preferentially obtain the network namespace of the container from this directory
    - If this directory cannot be accessed, the network namespace of the container will be obtained through `/proc/$pid/ns/net`, in this case, there are two problems：
      - The file will disappear when the process stops
      - Different PID may correspond to the same namespace
- The rights needed to collect AF_PACKET traffic include
  - `[Must have]` Container rights：`HOST_NET`
  - `[Must have]` Kernel rights：`NET_RAW`、`NET_ADMIN`
  - `[Recommended]` Kernel rights：`IPC_LOCK` (including MAP_LOCKED, MAP_NORESERVE)
    - Without this authority, the performance of cBPF will be significantly affected and a WARN log reminder will be printed
- The rights needed to collect eBPF data include
  - `[Must have]` System rights：`SELINUX = disabled`
  - `[Recommended]` Kernel rights：`SYS_ADMIN`
    - In the kernel `Linux 5.8+`, `SYS_ADMIN` is not needed, and can be replaced by a combination of `BPF` and `PERFMON`
    - Using `SYS_ADMIN` rights has no version dependency on the kernel `Linux 5.8+`
  - `[Must have]` Kernel rights：`SYS_RESOURCE`、`SYSLOG`
  - `[Must have]` File rights：Read-only permission of `/sys/kernel/debug/` directory
    - Since the attach/detach operation of kprobe and uprobe type probes depends on the kernel debug subsystem, without this right, it is impossible to start eBPF
    - Also, since this directory can only be accessed by the root user, the deepflow-agent process `must run as the root user`
  - `[Must have]` Ensure that the content of the file `/proc/sys/kernel/kptr_restrict` is not equal to 2, otherwise Continuous Profiler will not be usable
    - When `kptr_restrict` is 2, all users cannot read the kernel symbol address, even if `CAP_SYSLOG` rights are given, they cannot read the kernel address
    - agent will detect the kernel symbol address at startup, if it cannot read it will print a WARN log reminder
    - Generally, this value is defaulted to 1 by the system, if this value is 2, the user can set the content of this file to 1 in advance
  - `[Recommended]` File rights：Read and write permission of `/proc/sys/net/core/bpf_jit_enable`
    - The eBPF performance will be significantly affected when the file content is not equal to 1
      - When the value is 1, deepflow-agent will read this value, if it does not have the read permission will print a WARN log reminder
      - When the value is not 1, deepflow-agent will try to modify it to 1, if the modification fails will print a WARN log reminder
    - If you want to have good eBPF performance without giving `write permission`, you can set the content of this file to 1 in advance
    - Under K8s, deepflow-agent DaemonSet will by default start a privileged init container to set this value to 1, enabling deepflow-agent to run in non-privileged mode

The deepflow-agent needs the following resources to synchronize information with the K8s apiserver regarding get/list/watch permissions：

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

In addition, to associate K8s tag information requires adaptation to CNI, DeepFlow has adapted to the following CNIs：

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
