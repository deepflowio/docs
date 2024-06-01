---
title: 基础资源标签
permalink: /features/auto-tagging/meta-tags
---

# 云资源标签

DeepFlow 目前支持资源信息同步的公有云厂商包括：
- AWS
- Aliyun 阿里云
- Baidu Cloud 百度云
- Huawei Cloud 华为云
- Microsoft Azure
- QingCloud 青云
- Tencent Cloud 腾讯云

支持自动注入的资源标签信息包括：
- 区域
- 可用区
- 云服务器
- VPC
- 子网
- 路由器
- 安全组
- NAT网关
- 负载均衡器
- 对等连接
- 云企业网
- RDS
- Redis

# K8s 资源标签

DeepFlow 支持自动注入的 K8s 资源信息包括：
- 集群
- 节点
- 命名空间
- 容器服务
- Ingress
- 工作负载
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet / InPlaceSet
- Pod
