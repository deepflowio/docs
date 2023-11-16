---
title: Special Environment Deployment
permalink: /best-practice/special-environment-deployment/
---

> This document was translated by GPT-4

# Special CNI

## MACVlan

When K8s uses the macvlan CNI, only one virtual network card shared by all PODs can be seen under rootns, at this time, extra configuration is needed for the deepflow-agent:

1. Create the agent-group and agent-group-config:

   ```bash
   deepflow-ctl agent-group create macvlan
   deepflow-ctl agent-group-config create macvlan
   ```

2. Obtain the macvlan agent-group ID:

   ```bash
   deepflow-ctl agent-group list  | grep macvlan
   ```

3. Create a new agent-group-config configuration file `macvlan-agent-group-config.yaml`:

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

4. Create an agent-group-config:

   ```bash
   deepflow-ctl agent-group-config create -f macvlan-agent-group-config.yaml
   ```

5. Modify the agent-group of deepflow-agent:
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
   Using deepflow-ctl delete the macvlan's agent:
   ```bash
   deepflow-ctl agent delete <agent name>
   ```
   Start deepflow-agent:
   ```bash
   kubectl -n deepflow  patch daemonset deepflow-agent --type json -p='[{"op": "remove", "path": "/spec/template/spec/nodeSelector/non-existing"}]'
   ```
   Check the deepflow agent list, ensure the agent has joined the macvlan group:
   ```bash
   deepflow-ctl agent list
   ```

# Special K8s Resources or CRD

For these scenarios, you need to:

- Enable or disable the corresponding resources in the advanced configuration of the Agent
- Configure Kubernetes API permissions

## OpenShift

In this scenario, we need disable the default `Ingress` resource acquisition and enable `Route` resource acquisition.

Agent advanced configuration are as follows:

```yaml
static_config:
  kubernetes-resources:
    - name: ingresses
      disabled: true
    - name: routes
```

Need to add in the ClusterRole configuration:

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

In this scenario, you need to get `CloneSet` and `apps.kruise.io/StatefulSet` resources from the API.

Agent advanced configuration are as follows:

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

Here, you need to add Kubernetes `apps/StatefulSet`.

Need to add in the ClusterRole configuration:

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

# Restricted Agent Runtime Permissions

## Lack of Daemonset Deployment Permissions

When there is no permission to run the Daemonset in the Kubernetes cluster, but normal processes can be run directly on the K8s Node, this method can be used to implement Agent's deployment.

- Deploy a deepflow-agent in a deployment manner
  - By setting the environment variable `ONLY_WATCH_K8S_RESOURCE`, this agent only implements functions of list-watching K8s resources and uploading to controller
  - All other functions of this agent will be automatically closed
  - When the agent requests the server, it informs that it is on watch-k8s, and the server updates this information to the MySQL database
  - This agent, which is used only for watching, will not appear on the Agent list
- In this K8s cluster, a regular deepflow-agent runs in the form of a Linux process on each K8s Node
  - Since these agents do not have the `IN_CONTAINER` environment variable, they do not list-watch K8s resources
  - These agents continue to acquire POD's IP and MAC addresses and synchronize to the server
  - These agents will complete all the observation data collection functions
  - The agent type that the server delivers to these agents is K8s

### Deploy DeepFlow Agent in Deployment Mode

```bash
cat << EOF > values-custom.yaml
deployComponent:
- "watcher"
clusterNAME: process-example
EOF

helm install deepflow -n deepflow deepflow/deepflow-agent --create-namespace \
  -f values-custom.yaml
```

After deployment, a Domain corresponding to this K8s cluster will be automatically created. By `deepflow-ctl domain list` to get the `kubernetes-cluster-id` of `process-example` cluster, then continue with the following operations.

### Deploy DeepFlow Agent in Ordinary Process Mode

- Refer to [Deploy DeepFlow Agent on Traditional Servers](../ce-install/legacy-host/), but there is no need to create Domain
- Modify the agent configuration file `/etc/deepflow-agent/deepflow-agent.yaml`, fill in the cluster ID obtained in the previous step for `kubernetes-cluster-id`

## No Request to Apiserver Allowed

By default, the DeepFlow Agent runs in Daemonset mode in K8s. But in some cases, to protect the apiserver from overload, the Daemonset is not allowed to request the apiserver. In this case, you can also use a similar method to the "No Daemonset deployment permission" in this article for deployment:

- Deploy a deepflow-agent deployment, which only responsible for list-watch apiserver and sync K8s resource information
- Deploy a deepflow-agent daemonset, any Pod won't list-watch apiserver
