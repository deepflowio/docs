---
title: Agent Deployment in Special Environments
permalink: /best-practice/special-environment-deployment/
---

> This document was translated by ChatGPT

# Special K8s CNI

In common K8s environments, DeepFlow Agent can collect full-stack observability signals, as shown in the upper left corner of the figure below:

- When two Pods on the same Node communicate, data can be collected from two locations: eBPF Syscall and cBPF Pod NIC.
- When two Pods on different Nodes communicate, data can be collected from three locations: eBPF Syscall, cBPF Pod NIC, and cBPF Node NIC.

![Data collection capabilities under different K8s CNIs (Pod-to-Pod communication scenario)](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231114002715.png)

However, under certain CNIs, due to the particularity of the traffic path, the data collected by DeepFlow Agent will differ:

- In a Cilium CNI environment (upper right corner of the figure above):
  - Cilium [uses XDP](https://docs.cilium.io/en/stable/network/ebpf/intro/) to bypass the TCP/IP protocol stack, resulting in only unidirectional traffic being visible on the Pod NIC named lxc-xxx.
  - When two Pods on the same Node communicate, data can be collected only from the eBPF Syscall location.
  - When two Pods on different Nodes communicate, data can be collected from eBPF Syscall and cBPF Node NIC, the latter collected from Node eth0.
- In MACVlan, [Huawei Cloud CCE Turbo](https://support.huaweicloud.com/usermanual-cce/cce_10_0284.html), and other CNI environments (lower left corner of the figure above):
  - MACVlan sub-interfaces are used instead of Veth-Pair + Bridge. In this case, there is no corresponding Pod NIC in the Root Netns, but all Pod traffic can be seen on Node eth0.
  - In this case, DeepFlow Agent can be configured as described below with `tap_mode = 1 (virtual mirror)`, treating the traffic on the Node NIC as if it were collected on the Pod NIC.
  - When two Pods on the same Node communicate, data can be collected from eBPF Syscall and cBPF Pod NIC, the latter collected from Node eth0.
    - However, since there is only one copy of the communication traffic on eth0, the client and server share the same cBPF Pod NIC data.
  - When two Pods on different Nodes communicate, data can be collected from eBPF Syscall and cBPF Pod NIC, the latter collected from Node eth0.
- In an IPVlan CNI environment (lower right corner of the figure above):
  - IPVlan sub-interfaces are used instead of Veth-Pair + Bridge. In this case, there is no corresponding Pod NIC in the Root Netns, and only Pod traffic entering and leaving the Node can be seen on Node eth0.
  - When two Pods on the same Node communicate, data can be collected only from the eBPF Syscall location.
  - When two Pods on different Nodes communicate, data can be collected from eBPF Syscall and cBPF Node NIC, the latter collected from Node eth0.

In addition, eBPF XDP can also be used in combination with IPVlan (for example, [Alibaba Cloud's Terway CNI](https://developer.aliyun.com/article/1221415)), in which case the traffic collection capability is equivalent to Cilium or IPVlan.

Some reference materials:

- [Bridge vs Macvlan](https://hicu.be/bridge-vs-macvlan)
- [Macvlan vs Ipvlan](https://hicu.be/macvlan-vs-ipvlan)
- [Packet Walk(s) In Kubernetes](https://events19.linuxfoundation.org/wp-content/uploads/2018/07/Packet_Walks_In_Kubernetes-v4.pdf)

## MACVlan

### Collecting Only NIC Traffic in RootNS

When K8s uses macvlan CNI, only a single virtual NIC shared by all Pods can be seen in rootns. In this case, additional configuration is required for deepflow-agent:

1. Create agent-group and agent-group-config:

   ```bash
   deepflow-ctl agent-group create macvlan
   deepflow-ctl agent-group-config create macvlan
   ```

2. Get the macvlan agent-group ID:

   ```bash
   deepflow-ctl agent-group list  | grep macvlan
   ```

3. Create a new agent-group-config file `macvlan-agent-group-config.yaml`:

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

4. Create agent-group-config:

   ```bash
   deepflow-ctl agent-group-config create -f macvlan-agent-group-config.yaml
   ```

5. Modify the deepflow-agent's agent-group:
   ```bash
   kubectl edit cm -n deepflow deepflow-agent
   ```
   Add configuration:
   ```yaml
   vtap-group-id-request: g-xxxxx
   ```
   Stop deepflow-agent:
   ```bash
   kubectl -n deepflow  patch daemonset deepflow-agent  -p '{"spec": {"template": {"spec": {"nodeSelector": {"non-existing": "true"}}}}}'
   ```
   Delete the macvlan agent via deepflow-ctl:
   ```bash
   deepflow-ctl agent delete <agent name>
   ```
   Start deepflow-agent:
   ```bash
   kubectl -n deepflow  patch daemonset deepflow-agent --type json -p='[{"op": "remove", "path": "/spec/template/spec/nodeSelector/non-existing"}]'
   ```
   Check the deepflow agent list to ensure the agent has joined the macvlan group:
   ```bash
   deepflow-ctl agent list
   ```

### Collecting NIC Traffic in Both RootNS and PodNS

Refer to [the documentation](../configuration/agent/#inputs.cbpf.af_packet.inner_interface_capture_enabled) to enable `inputs.cbpf.af_packet.inner_interface_capture_enabled` in deepflow-agent to collect NIC traffic in PodNS.

Note that the following configurations also need to be adjusted:

- `inputs.cbpf.af_packet.tunning.ring_blocks_enabled`: Allows AF_PACKET memory consumption to be adjustable.
- `inputs.cbpf.af_packet.tunning.ring_blocks`: Allows reducing the total memory consumption of all AF_PACKETs.
- `inputs.cbpf.af_packet.inner_interface_regex`: Ensures correct matching of NIC names inside PodNS.

## Huawei Cloud CCE Turbo

Refer to the MACVlan configuration method.

## IPVlan

The only thing to note is that the Agent's tap_interface_regex only needs to be configured as the Node NIC list.

## Cilium eBPF

The only thing to note is that the Agent's tap_interface_regex only needs to be configured as the Node NIC list.

# K8s Agent Permission Restrictions

## No Permission to Deploy K8s Daemonset

When you do not have permission to run a Daemonset in a Kubernetes cluster but can run regular processes directly on K8s Nodes, you can use this method to deploy the Agent.

- Deploy a deepflow-agent as a deployment
  - By setting the environment variable `K8S_WATCH_POLICY=watch-only`, this agent will only perform list-watch of K8s resources and send them to the controller.
  - All other functions of this agent will be automatically disabled.
  - When the agent requests the server, it informs that it is watch-k8s, and the server updates this information in the MySQL database.
  - This Agent, used only as a Watcher, will not appear in the Agent list.
- In this K8s cluster, run a regular-function deepflow-agent as a Linux process on each K8s Node
  - Since these agents do not have the `IN_CONTAINER` environment variable, they will not list-watch K8s resources.
  - These agents will still obtain the IP and MAC addresses of Pods and synchronize them to the server.
  - These agents will perform all observability data collection functions.
  - The server will issue the Agent type as K8s to these agents.

### Deploying DeepFlow Agent in Deployment Mode

```bash
cat << EOF > values-custom.yaml
deployComponent:
- "watcher"
clusterNAME: your-cluster-name
EOF

helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```

After deployment, a Domain (corresponding to this K8s cluster) will be automatically created. Obtain the `kubernetes-cluster-id` of the `your-cluster-name` cluster from `deepflow-ctl domain list`, and then proceed with the following steps.

### Deploying DeepFlow Agent as a Regular Process

- Refer to [Deploying DeepFlow Agent on Legacy Hosts](../ce-install/legacy-host/), but there is no need to create a Domain.
- Modify the agent configuration file `/etc/deepflow-agent/deepflow-agent.yaml`, and fill in the cluster ID obtained in the previous step for `kubernetes-cluster-id`.

## Daemonset Not Allowed to Request apiserver

By default, DeepFlow Agent runs as a Daemonset in K8s. However, in some cases, to protect the apiserver from overload, the Daemonset is not allowed to request the apiserver. In this case, you can also use a similar method to "No Permission to Deploy Daemonset" described above:

- Deploy a deepflow-agent deployment that only performs list-watch of the apiserver and synchronizes K8s resource information.
- Deploy a deepflow-agent daemonset where no Pod will list-watch the apiserver.

## deepflow-agent Not Allowed to Request apiserver

deepflow-server relies on K8s resource information reported by deepflow-agent to implement AutoTagging. When your environment does not allow deepflow-agent to directly watch the K8s apiserver, you can implement a dedicated pseudo-deepflow-agent to synchronize K8s resources. This pseudo-deepflow-agent needs to implement the following functions:

- Periodically list-watch the K8s apiserver to obtain the latest K8s resource information.
- Call the deepflow-server gRPC interface to report K8s resource information.

### gRPC Interface

The interface for reporting K8s resource information is ([GitHub code link](https://github.com/deepflowio/deepflow/blob/main/message/trident.proto#L15)):

```protobuf
rpc KubernetesAPISync(KubernetesAPISyncRequest) returns (KubernetesAPISyncResponse) {}
```

Structure of the message reported by pseudo-deepflow-agent (GitHub code link as above):

```protobuf
message KubernetesAPISyncRequest {
    // Unless otherwise specified, all fields below are required.

    // K8s cluster identifier.
    // Please use the value configured in deepflow-agent.yaml in the same K8s cluster.
    optional string cluster_id = 1;

    // Version number of the resource information.
    // When K8s resource information changes, ensure this version number also changes, usually using Linux Epoch.
    // When K8s resource information has not changed, carry the previous version number, and entries do not need to be transmitted.
    // Even if the resource information has not changed, periodically request deepflow-server, ensuring the interval between two requests does not exceed 24 hours.
    optional uint64 version = 2;

    // Error message.
    // When calling the K8s API fails or other errors occur, use this field to inform deepflow-server.
    // When error_msg exists, it is recommended to carry the version and entries fields used in the previous request.
    optional string error_msg = 3;

    // Source IP address.
    // Usually, this can be the client IP address used by pseudo-deepflow-agent when making the gRPC request.
    // Using a representative and distinctive source_ip makes it easier to check deepflow-server logs to identify the requester.
    optional string source_ip = 5;

    // All information of various K8s resources.
    // Please note that all types of all resources must be included; resources not present will be considered deleted by deepflow-server.
    repeated common.KubernetesAPIInfo entries = 10;
}

message KubernetesAPIInfo {
    // K8s resource type. Currently supported resource types are:
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

    // List of resources of this type.
    // Note: Please serialize using JSON, then compress with zlib, and transmit the compressed byte stream.
    optional bytes compressed_info = 3;
}
```

Structure of the message replied by deepflow-server (GitHub code link as above):

```protobuf
message KubernetesAPISyncResponse {
    // Version number of the resource information accepted by deepflow-server, usually equal to the version in the most recent request.
    optional uint64 version = 1;
}
```

### KubernetesAPIInfo

Note that deepflow-server requires certain K8s resource types to be reported, including:

- `*v1.Node`
- `*v1.Namespace`
- `*v1.Pod`
- `*v1.Deployment`, `*v1.StatefulSet`, `*v1.DaemonSet`, `*v1.ReplicationController`, `*v1.ReplicaSet`: Report as needed based on the Pod's workload type.

Other resources are optional:

- `*v1.Service`
- `*v1beta1.Ingress`

For the above resources, the information that pseudo-deepflow-agent needs to report can be found in [this documentation](../features/auto-tagging/meta-tags/#依赖的-k8s-api).

# Cloud Server Agent Permission Restrictions

## Running deepflow-agent as a Non-root User

Suppose we want to run the Agent installed at /usr/sbin/deepflow-agent as a regular user named deepflow. We must first grant the necessary permissions to deepflow as the root user:

```bash
## Use the root user to grant execution permissions to the deepflow-agent
setcap cap_sys_ptrace,cap_net_raw,cap_net_admin,cap_ipc_lock,cap_sys_admin=eip /usr/sbin/deepflow-agent
mkdir /sys/fs/cgroup/cpu/deepflow-agent
mkdir /sys/fs/cgroup/memory/deepflow-agent
chown -R deepflow:deepflow /sys/fs/cgroup/cpu/deepflow-agent
chown -R deepflow:deepflow /sys/fs/cgroup/memory/deepflow-agent
chown -R deepflow:deepflow /usr/sbin/deepflow-agent
```

Run deepflow-agent as a non-root user, for example:

```bash
systemctl start deepflow-agent
```

If you want to uninstall deepflow-agent, be sure to remove the corresponding permissions:

```bash
## Use the root user to revoke execution permissions from the deepflow-agent
setcap -r /usr/sbin/deepflow-agent
rmdir /sys/fs/cgroup/cpu/deepflow-agent
rmdir /sys/fs/cgroup/memory/deepflow-agent
```

# Agent Accessing Server via LB

## Network Between Agent and Server Cluster Restricted, Requires LB Connection

When deepflow-agent needs to access deepflow-server via an external load balancer, configure two load balancer listeners on the LB to forward to the deepflow-server's NodePort Service (port 30033 for agent registration, port 30035 for agent data reporting), and add the LB's address and port in the [agent-group-config](./../configuration/agent/). The specific configuration is as follows:

> Note: Unless in special cases such as network isolation, it is not recommended to use the LB access solution. By default, the agent will automatically select the server node based on the data volume to achieve dynamic load balancing; when accessing via LB, the data reporting path will be limited by the LB's load strategy, which may cause uneven server node load.

```yaml
global:
  communication:
    ingester_port: $LB_PORT
    proxy_controller_port: $LB_PORT
    ingester_ip: $LB_IP
    proxy_controller_ip: $LB_IP
```