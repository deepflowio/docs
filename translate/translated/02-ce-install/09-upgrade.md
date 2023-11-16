---
title: DeepFlow Upgrade
permalink: /ce-install/upgrade/
---

> This document was translated by GPT-4

# Introduction

Upgrade DeepFlow to the latest version and get the latest Grafana dashboard.

# Upgrade DeepFlow Server

Upgrade DeepFlow Server and the DeepFlow Agent of this cluster with one click through Helm:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
```

# DeepFlow CLI Upgrade

Download the latest deepflow-ctl:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/stable/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Upgrade DeepFlow Agent

## Upgrading the Agent in the K8s Cluster

Upgrade the DeepFlow Agent with one click through Helm:

```bash
helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade deepflow-agent -n deepflow deepflow/deepflow-agent -f values-custom.yaml
```

## Remote Upgrade of Agent in Cloud Server

Upgrade the DeepFlow Agent deployed on the cloud servers and traditional servers through deepflow-ctl:

1. Download the latest deepflow-agent：

   ```bash
   curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/stable/linux/amd64/deepflow-agent.tar.gz
   tar -zxvf deepflow-agent.tar.gz -C /usr/sbin/
   ```

2. Upload the local binary to MySQL database for preservation:

   ```bash
   deepflow-ctl repo agent create --arch x86 --image /usr/sbin/deepflow-agent
   ```

   If the same file name binary is uploaded multiple times, it will be overwritten; the uploaded binary will be compressed with a compression ratio of about 3.4.

3. View the packages in the repository:

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

# Get the Latest DeepFlow Grafana Dashboard

Check if the image of Grafana's init container `init-grafana-ds-dh` is `latest`, and if the image pulling policy is `Always`:

```bash
kubectl get deployment -n deepflow deepflow-grafana -o yaml|grep -E 'image:|imagePullPolicy'
```

If the image of Grafana's init container `init-grafana-ds-dh` is not `latest`, or the image pulling policy is not `Always`, please change it to `latest` and `Always`.

Restart Grafana, pull the latest init container `init-grafana-ds-dh` image, and get the latest dashboard :

```bash
kubectl delete pods -n deepflow -l app.kubernetes.io/instance=deepflow -l app.kubernetes.io/name=grafana
```
