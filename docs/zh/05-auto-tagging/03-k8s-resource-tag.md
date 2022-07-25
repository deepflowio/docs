---
title: K8s 资源信息注入
permalink: /auto-tagging/k8s-resource-tag
---

DeepFlow 支持自动注入的 K8s 资源信息包括：
- 集群
- 节点
- 命名空间
- 服务
- Ingress
- 工作负载
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
- ReplicaSet / InPlaceSet
- Pod

通过流量关联 K8s 资源信息还需要对 CNI 有深入的适配，目前 DeepFlow 适配的 CNI 包括：
- Flannel
- Calico
- Multus
- Open vSwitch
- Weave
- IPVlan
- TKE GlobalRouter
- TKE VPC-CNI
- ACK Terway
- QKE HostNIC
