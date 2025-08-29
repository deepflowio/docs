---
title: DeepFlow Upgrade
permalink: /ce-install/upgrade/
---

> This document was translated by ChatGPT

# Introduction

Upgrade DeepFlow to the latest version and obtain the latest Grafana dashboard.

# Upgrade DeepFlow Server

Use Helm to upgrade DeepFlow Server and the DeepFlow Agent in this cluster with one command:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
```

# Upgrade DeepFlow CLI

Download the latest deepflow-ctl:

```bash
# Keep it in sync with the current server version
Version=v6.6

# Download using the variable
curl -o /usr/bin/deepflow-ctl \
  "https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/$Version/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl"

# Add execute permission
chmod a+x /usr/bin/deepflow-ctl
```

# Upgrade DeepFlow Agent

## Upgrade Agents in a K8s Cluster

Use Helm to upgrade DeepFlow Agent with one command:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent -f values-custom.yaml
```

## Remotely Upgrade Agents on Cloud Servers

Use deepflow-ctl to upgrade DeepFlow Agents deployed on cloud servers and traditional servers:

1. Download the latest deepflow-agent:

   ```bash
   curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/stable/linux/amd64/deepflow-agent.tar.gz
   tar -zxvf deepflow-agent.tar.gz -C /usr/sbin/
   ```

2. Upload the local binary to the MySQL database for storage:

   ```bash
   deepflow-ctl repo agent create --arch x86 --image /usr/sbin/deepflow-agent
   ```

   If you upload a binary with the same file name multiple times, it will be overwritten; the uploaded binary will be compressed, with a compression ratio of about 3.4.

3. View the packages in the repository:

   ```bash
   deepflow-ctl repo agent list
   ```

4. Perform the upgrade:
   ```bash
   OUTPUT=$(deepflow-ctl agent list | head -n 1)
   if [[ $OUTPUT == "VTAP_ID"* ]]; then
      for AGENT in $(deepflow-ctl agent list | grep -E " CHOST_[VB]M " | awk '{print $2}')
      do
         deepflow-ctl agent-upgrade $AGENT --image-name=deepflow-agent
      done
   else
      for AGENT in $(deepflow-ctl agent list | grep -E " CHOST_[VB]M " | awk '{print $1}')
      do
         deepflow-ctl agent-upgrade $AGENT --image-name=deepflow-agent
       done
   fi
   ```

## Remotely Upgrade K8s Agents

Remote upgrade of Agents can reduce operation steps and improve upgrade speed when upgrading multiple clusters in batches.

K8s remote upgrade uses deepflow-agent in the cluster with permissions to modify the daemonset and configmap in its namespace, and modifies its own daemonset parameters for remote upgrade.

Add the image of the deepflow-agent to be upgraded. The `--version-image` in the command should point to the deepflow-agent binary of the same version as the K8s image, so that deepflow-ctl can obtain the version information of the image. Make sure the K8s cluster to be upgraded can correctly pull the image specified by `--k8s-image`.

```bash
deepflow-ctl repo agent create --arch x86 \
   --version-image /root/deepflow-agent \
   --k8s-image registry.cn-beijing.aliyuncs.com/deepflow-ce/deepflowio-agent:latest
```

Execute the remote upgrade command for deepflow-agent. In a cluster, you only need to specify one agent to upgrade all agents in the cluster.

```bash
deepflow-ctl agent-upgrade <AGENT_NAME> \
   --image-name="kube.registry.local:5000/deepflow-agent:v6.4.4594"
```

- **Note**: The current version does not support verifying whether the image can be pulled and is available. Please ensure the image can be pulled, run, and has the correct version before use.
- **Note**: In a K8s cluster, only one deepflow-agent needs to be selected to trigger the upgrade. It will modify the daemonset configuration so that all deepflow-agents are upgraded.
- **Note**: Be prepared to manually intervene to fix the image (due to reasons such as the image being unavailable or unable to run).

# Get the Latest DeepFlow Grafana Dashboard

Check whether the image of Grafana's init container `init-grafana-ds-dh` is `latest` and whether the image pull policy is `Always`:

```bash
kubectl get deployment -n deepflow deepflow-grafana -o yaml|grep -E 'image:|imagePullPolicy'
```

If the image of Grafana's init container `init-grafana-ds-dh` is not `latest` and the image pull policy is not `Always`, please change them to `latest` and `Always`.

Restart Grafana to pull the latest init container `init-grafana-ds-dh` image and get the latest dashboard:

```bash
kubectl delete pods -n deepflow -l app.kubernetes.io/instance=deepflow -l app.kubernetes.io/name=grafana
```