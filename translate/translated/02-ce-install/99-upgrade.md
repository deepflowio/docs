---
title: DeepFlow Upgrade
permalink: /ce-install/upgrade/
---

> This document was translated by ChatGPT

# Introduction

Upgrade DeepFlow to the latest version and obtain the latest Grafana dashboard.

# Upgrade DeepFlow Server

Upgrade DeepFlow Server and the DeepFlow Agent in this cluster with a single Helm command:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
```

# Upgrade DeepFlow CLI

Download the latest deepflow-ctl:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Upgrade DeepFlow Agent

## Upgrade Agent in K8s Cluster

Upgrade DeepFlow Agent with a single Helm command:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent -f values-custom.yaml
```

## Remote Upgrade Agent on Cloud Servers

Upgrade DeepFlow Agent deployed on cloud servers and traditional servers using deepflow-ctl:

1. Download the latest deepflow-agent:

   ```bash
   curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/stable/linux/amd64/deepflow-agent.tar.gz
   tar -zxvf deepflow-agent.tar.gz -C /usr/sbin/
   ```

2. Upload the local binary to the MySQL database for storage:

   ```bash
   deepflow-ctl repo agent create --arch x86 --image /usr/sbin/deepflow-agent
   ```

   If the same binary file name is uploaded multiple times, it will be overwritten; the uploaded binary will be compressed with a compression ratio of about 3.4.

3. List the packages in the repository:

   ```bash
   deepflow-ctl repo agent list
   ```

4. Execute the upgrade:
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

## Remote Upgrade K8s Agent

Remote upgrading of agents can reduce operational steps and increase upgrade speed when upgrading multiple clusters in bulk.

K8s remote upgrade uses deepflow-agent to modify the permissions of the daemonset and configmap in its namespace, and modify its own daemonset parameters for remote upgrade.

Add the image of the deepflow-agent to be upgraded. The --version-image in the command needs to point to the deepflow-agent binary file of the same version as the K8s image, so that deepflow-ctl can obtain the version information of the image. Ensure that the K8s cluster to be upgraded can correctly pull the image corresponding to --k8s-image.

```bash
deepflow-ctl repo agent create --arch x86 \
   --version-image /root/deepflow-agent \
   --k8s-image registry.cn-beijing.aliyuncs.com/deepflow-ce/deepflowio-agent:latest
```

Execute the remote upgrade command of deepflow-agent. Only one agent in a cluster needs to be specified to upgrade all agents in the cluster.

```bash
deepflow-ctl agent-upgrade <AGENT_NAME> \
   --image-name="kube.registry.local:5000/deepflow-agent:v6.4.4594"
```

- **Note**: The current version does not support verifying the pullability and availability of the image. Please ensure that the image can be pulled, run, and the version is correct before use.
- **Note**: Only one deepflow-agent needs to be selected in a K8s cluster to trigger the upgrade. It will modify the configuration of the daemonset itself, so that all deepflow-agents are upgraded.
- **Note**: Be prepared to manually intervene to correct the image (due to reasons such as the image cannot be pulled or run).

# Obtain the Latest DeepFlow Grafana Dashboard

Check if the image of the init container `init-grafana-ds-dh` of Grafana is `latest` and if the image pull policy is `Always`:

```bash
kubectl get deployment -n deepflow deepflow-grafana -o yaml|grep -E 'image:|imagePullPolicy'
```

If the image of the init container `init-grafana-ds-dh` of Grafana is not `latest` and the image pull policy is not `Always`, please modify them to `latest` and `Always`.

Restart Grafana to pull the latest init container `init-grafana-ds-dh` image and obtain the latest dashboard:

```bash
kubectl delete pods -n deepflow -l app.kubernetes.io/instance=deepflow -l app.kubernetes.io/name=grafana
```