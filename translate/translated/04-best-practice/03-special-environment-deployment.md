---
title: Special Environment Agent Deployment
permalink: /best-practice/special-environment-deployment/
---

> This document was translated by ChatGPT

# Special K8s CNI

In common K8s environments, the DeepFlow Agent can collect full-stack observability signals, as shown in the top left of the figure below:

- When two Pods on the same Node communicate, data can be collected from two locations: eBPF Syscall and cBPF Pod NIC.
- When two Pods on different Nodes communicate, data can be collected from three locations: eBPF Syscall, cBPF Pod NIC, and cBPF Node NIC.

![Data collection capabilities under different K8s CNIs (Pod-to-Pod communication scenarios)](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231114002715.png)

However, under certain CNIs, due to the uniqueness of the traffic path, the data collected by the DeepFlow Agent will differ:

- In the Cilium CNI environment (top right of the figure above):
  - Cilium [uses XDP](https://docs.cilium.io/en/stable/network/ebpf/intro/) to bypass the TCP/IP stack, resulting in only seeing unidirectional traffic on the Pod NIC named lxc-xxx.
  - When two Pods on the same Node communicate, data can be collected from one location: eBPF Syscall.
  - When two Pods on different Nodes communicate, data can be collected from two locations: eBPF Syscall and cBPF Node NIC, the latter collected from Node eth0.
- In MACVlan, [Huawei Cloud CCE Turbo](https://support.huaweicloud.com/usermanual-cce/cce_10_0284.html), and other CNI environments (bottom left of the figure above):
  - Using MACVlan sub-interfaces instead of Veth-Pair + Bridge, there is no corresponding Pod NIC in the Root Netns, but all Pod traffic can be seen on Node eth0.
  - In this case, the DeepFlow Agent can be configured with `tap_mode = 1 (virtual mirror)` to treat the traffic on the Node NIC as if it were collected on the Pod NIC.
  - When two Pods on the same Node communicate, data can be collected from two locations: eBPF Syscall and cBPF Pod NIC, the latter collected from Node eth0.
    - However, since there is only one copy of the communication traffic on eth0, the client and server share the same cBPF Pod NIC data.
  - When two Pods on different Nodes communicate, data can be collected from two locations: eBPF Syscall and cBPF Pod NIC, the latter collected from Node eth0.
- In the IPVlan CNI environment (bottom right of the figure above):
  - Using IPVlan sub-interfaces instead of Veth-Pair + Bridge, there is no corresponding Pod NIC in the Root Netns, and only the traffic of Pods entering and leaving the Node can be seen on Node eth0.
  - When two Pods on the same Node communicate, data can be collected from one location: eBPF Syscall.
  - When two Pods on different Nodes communicate, data can be collected from two locations: eBPF Syscall and cBPF Node NIC, the latter collected from Node eth0.

Additionally, eBPF XDP can also be used in conjunction with IPVlan (e.g., [Alibaba Cloud's Terway CNI](https://developer.aliyun.com/article/1221415)), where the traffic collection capability is equivalent to Cilium or IPVlan.

Some reference materials:

- [Bridge vs Macvlan](https://hicu.be/bridge-vs-macvlan)
- [Macvlan vs Ipvlan](https://hicu.be/macvlan-vs-ipvlan)
- [Packet Walk(s) In Kubernetes](https://events19.linuxfoundation.org/wp-content/uploads/2018/07/Packet_Walks_In_Kubernetes-v4.pdf)

## MACVlan

When K8s uses the macvlan CNI, only a single virtual NIC shared by all PODs can be seen under rootns. In this case, additional configuration for the deepflow-agent is required:

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

5. Modify the agent-group of deepflow-agent:
   ```bash
   kubectl edit cm -n deepflow deepflow-agent
   ```
   Add the configuration:
   ```yaml
   vtap-group-id-request: g-xxxxx
   ```
   Stop the deepflow-agent:
   ```bash
   kubectl -n deepflow  patch daemonset deepflow-agent  -p '{"spec": {"template": {"spec": {"nodeSelector": {"non-existing": "true"}}}}}'
   ```
   Delete the macvlan agent through deepflow-ctl:
   ```bash
   deepflow-ctl agent delete <agent name>
   ```
   Start the deepflow-agent:
   ```bash
   kubectl -n deepflow  patch daemonset deepflow-agent --type json -p='[{"op": "remove", "path": "/spec/template/spec/nodeSelector/non-existing"}]'
   ```
   Check the deepflow agent list to ensure the agent has joined the macvlan group:
   ```bash
   deepflow-ctl agent list
   ```

## Huawei Cloud CCE Turbo

Refer to the MACVlan configuration method.

## IPVlan

The only thing to note is that the tap_interface_regex of the collector only needs to be configured as the Node NIC list.

## Cilium eBPF

The only thing to note is that the tap_interface_regex of the collector only needs to be configured as the Node NIC list.

# Special K8s Resources or CRD

In such scenarios, the following operations are required:

- Enable and disable the corresponding resources in the Agent advanced configuration
- Configure Kubernetes API permissions

## OpenShift

In this scenario, the default `Ingress` resource acquisition needs to be disabled, and the `Route` resource acquisition needs to be enabled.

Agent advanced configuration is as follows:

```yaml
static_config:
  kubernetes-resources:
    - name: ingresses
      disabled: true
    - name: routes
```

ClusterRole configuration addition:

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

In this scenario, the `CloneSet` and `apps.kruise.io/StatefulSet` resources need to be obtained from the API.

Agent advanced configuration is as follows:

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

Note that Kubernetes `apps/StatefulSet` also needs to be included.

ClusterRole configuration addition:

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

# Limited Permissions for Running Agent in K8s

## No Permission to Deploy K8s Daemonset

When there is no permission to run Daemonset in the Kubernetes cluster, but it is possible to run ordinary processes directly on K8s Nodes, this method can be used to deploy the Agent.

- Deploy a deepflow-agent in the form of a deployment
  - By setting the environment variable `ONLY_WATCH_K8S_RESOURCE`, this agent only performs list-watch of K8s resources and sends them to the controller
  - All other functions of this agent will be automatically disabled
  - When the agent requests the server, it informs that it is watch-k8s, and the server updates this information in the MySQL database
  - This Agent, used only as a Watcher, will not appear in the Agent list
- In this K8s cluster, run a deepflow-agent with regular functions on each K8s Node in the form of a Linux process
  - Since these agents do not have the `IN_CONTAINER` environment variable, they will not list-watch K8s resources
  - These agents will still obtain the IP and MAC addresses of PODs and synchronize them to the server
  - These agents will complete all observability data collection functions
  - The server will issue the Agent type as K8s to these agents

### Deploy DeepFlow Agent in Deployment Mode

```bash
cat << EOF > values-custom.yaml
deployComponent:
- "watcher"
clusterNAME: your-cluster-name
EOF

helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```

After deployment, a Domain (corresponding to this K8s cluster) will be automatically created. Obtain the `kubernetes-cluster-id` of the `your-cluster-name` cluster from `deepflow-ctl domain list`, and then continue with the following operations.

### Deploy DeepFlow Agent as a Regular Process

- Refer to [Deploy DeepFlow Agent on Traditional Servers](../ce-install/legacy-host/), but do not create a Domain
- Modify the agent configuration file `/etc/deepflow-agent/deepflow-agent.yaml`, and fill in the cluster ID obtained in the previous step for `kubernetes-cluster-id`

## Daemonset Not Allowed to Request apiserver

By default, DeepFlow Agent runs in K8s as a Daemonset. However, in some cases, to protect the apiserver from overload, Daemonset is not allowed to request the apiserver. In this case, a similar method to "No Permission to Deploy Daemonset" in this document can be used:

- Deploy a deepflow-agent deployment, responsible only for list-watching the apiserver and synchronizing K8s resource information
- Deploy a deepflow-agent daemonset, where no Pod will list-watch the apiserver

## deepflow-agent Not Allowed to Request apiserver

deepflow-server relies on K8s resource information reported by deepflow-agent to achieve AutoTagging capability. When your environment does not allow deepflow-agent to directly watch the K8s apiserver, you can implement a pseudo-deepflow-agent specifically for synchronizing K8s resources. This pseudo-deepflow-agent needs to implement the following functions:

- Periodically list-watch the K8s apiserver to obtain the latest K8s resource information
- Report K8s resource information to deepflow-server via gRPC interface

### gRPC Interface

The interface for reporting K8s resource information is ([GitHub code link](https://github.com/deepflowio/deepflow/blob/main/message/trident.proto#L15)):

```protobuf
rpc KubernetesAPISync(KubernetesAPISyncRequest) returns (KubernetesAPISyncResponse) {}
```

The structure of the message reported by pseudo-deepflow-agent (GitHub code link as above):

```protobuf
message KubernetesAPISyncRequest {
    // Unless otherwise specified, all fields below must be included.

    // K8s cluster identifier.
    // Please use the value configured in deepflow-agent.yaml in the same K8s cluster.
    optional string cluster_id = 1;

    // Version number of the resource information.
    // When K8s resource information changes, ensure this version number also changes, usually using Linux Epoch.
    // When K8s resource information does not change, carry the version number from the last request, and entries do not need to be transmitted.
    // Even if the resource information does not change, request deepflow-server periodically, ensuring the interval between two requests does not exceed 24 hours.
    optional uint64 version = 2;

    // Error information.
    // When there is an error calling the K8s API or other errors occur, this field can be used to inform deepflow-server.
    // When error_msg is present, it is recommended to carry the version and entries fields from the last request.
    optional string error_msg = 3;

    // Source IP address.
    // Usually, this can be the client IP address used when pseudo-deepflow-agent requests gRPC.
    // Using a representative and distinctive source_ip can facilitate checking deepflow-server logs to locate the requester.
    optional string source_ip = 5;

    // All information of various K8s resources.
    // Note: All types of all resources need to be included. Resources not appearing will be considered deleted by deepflow-server.
    repeated common.KubernetesAPIInfo entries = 10;
}

message KubernetesAPIInfo {
    // K8s resource type, currently supported resource types are:
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
    // Note: Use JSON serialization, then compress with zlib, and transmit the compressed byte stream.
    optional bytes compressed_info = 3;
}
```

The structure of the response message from deepflow-server (GitHub code link as above):

```protobuf
message KubernetesAPISyncResponse {
    // The version number of the resource information accepted by deepflow-server, usually equal to the version in the most recent request.
    optional uint64 version = 1;
}
```

### KubernetesAPIInfo

Note that deepflow-server requires certain K8s resource types to be reported, including:

- `*v1.Node`
- `*v1.Namespace`
- `*v1.Pod`
- `*v1.Deployment`, `*v1.StatefulSet`, `*v1.DaemonSet`, `*v1.ReplicationController`, `*v1.ReplicaSet`: Report as needed based on the workload type of the Pod

Other resources can be optionally reported:

- `*v1.Service`
- `*v1beta1.Ingress`

For the above resources, the information that pseudo-deepflow-agent needs to report can be referenced [here](../features/auto-tagging/meta-tags/#依赖的-k8s-api).

# Limited Permissions for Running Agent on Cloud Servers

## Running deepflow-agent as a Non-root User

Assuming we want to run the Agent installed at /usr/sbin/deepflow-agent using a regular user deepflow, we must first grant the necessary permissions to deepflow using the root user:

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

If you want to uninstall deepflow-agent, remember to remove the corresponding permissions:

```bash
## Use the root user to revoke execution permissions from the deepflow-agent
setcap -r /usr/sbin/deepflow-agent
rmdir /sys/fs/cgroup/cpu/deepflow-agent
rmdir /sys/fs/cgroup/memory/deepflow-agent
```
